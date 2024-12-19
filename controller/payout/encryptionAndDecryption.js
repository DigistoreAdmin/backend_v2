const crypto = require("crypto");
secretKey = process.env.secretHexaKey
secretHexKey = process.env.secretHexaKey

/**
 * Generates a 16-byte IV with random characters within the ASCII range 47-126.
 * @returns {string} Generated IV as a string.
 */
function generateIv() {
  const lowAsciiLimit = 47; // letter '/'
  const highAsciiLimit = 126; // letter 'z'
  const ivLength = 16;
  let iv = "";

  for (let i = 0; i < ivLength; i++) {
    const randomChar = String.fromCharCode(
      lowAsciiLimit + Math.floor(Math.random() * (highAsciiLimit - lowAsciiLimit + 1))
    );
    iv += randomChar;
  }

  return iv;
}

/**
 * Encrypts the provided data using AES with a dynamic IV.
 * @param {string} dataToEncrypt - The data to be encrypted.
 * @param {string} secretHexKey - Secret key in hexadecimal format.
 * @returns {string} Base64 encoded encrypted data (IV + encrypted payload).
 */
function encrypt(dataToEncrypt, secretHexKey) {
  try {
    // Decode secret key from hex to bytes
    const secretKeyBytes = Buffer.from(secretHexKey, "hex");

    if (![16, 24, 32].includes(secretKeyBytes.length)) {
      throw new Error("Invalid Key Length, must be 16/24/32 bytes.");
    }

    // Generate IV
    const initVector = generateIv();
    console.log("Dynamic IV:", initVector);

    // Create cipher instance
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      secretKeyBytes,
      Buffer.from(initVector, "utf-8")
    );

    // Encrypt the data
    const encryptedPayload = Buffer.concat([
      cipher.update(dataToEncrypt, "utf-8"),
      cipher.final()
    ]);

    // Combine IV and encrypted payload
    const finalArray = Buffer.concat([
      Buffer.from(initVector, "utf-8"),
      encryptedPayload
    ]);

    // Return Base64 encoded result
    return finalArray.toString("base64");
  } catch (error) {
    console.error("Encryption Error:", error.message);
    return "";
  }
}

/**
 * Decrypts the provided encrypted data using AES with the IV embedded in the payload.
 * @param {string} encrypted - The Base64 encoded encrypted data (IV + encrypted payload).
 * @param {string} secretKey - Secret key in hexadecimal format.
 * @returns {string} Decrypted data as a string.
 */
function decrypt(encrypted, secretKey) {
  try {
    // Decode secret key from hex to bytes
    const secretKeyBytes = Buffer.from(secretKey, "hex");

    if (![16, 24, 32].includes(secretKeyBytes.length)) {
      throw new Error("Invalid Key Length, must be 16/24/32 bytes.");
    }

    // Decode the encrypted data from Base64
    const encryptedBytes = Buffer.from(encrypted, "base64");

    // Extract IV (first 16 bytes) and encrypted payload
    const iv = encryptedBytes.slice(0, 16);
    const encryptedPayload = encryptedBytes.slice(16);

    // Create decipher instance
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      secretKeyBytes,
      iv
    );

    // Decrypt the payload
    const decryptedBytes = Buffer.concat([
      decipher.update(encryptedPayload),
      decipher.final()
    ]);

    // Return decrypted data as string
    return decryptedBytes.toString("utf-8");
  } catch (error) {
    console.error("Decryption Error:", error.message);
    return "";
  }
}

// Main function for demonstration
// (function main() {
//   const secretHexaKey = "73616d706c65496466634145536b6579"; // 16-byte key in hexadecimal format
//   const data = "EncryptMe";

//   // Encryption
//   const encOutput = encrypt(data, secretHexaKey);
//   console.log("Encryption:", encOutput);

//   // Decryption
//   const decOutput = decrypt(encOutput, secretHexaKey);
//   console.log("Decryption:", decOutput);
// })();
