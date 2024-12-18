const jwt = require("jsonwebtoken");
const axios = require("axios");

// Static values shared by the bank
const clientId = "37798069-30dd-48af-b548-08490c1b574e";
const tokenUrl = "https://apiext.uat.idfcfirstbank.com/authorization/oauth2/token";
const kid = process.env.kid 
const aud = "https://app.uat-opt.idfcfirstbank.com/platform/oauth/oauth2/token";
const privateKey = process.env.privateKey;

// Step 1: Generate JWT Token
function generateJwtToken() {
  const header = {
    alg: "RS256",
    typ: "JWT",
    kid: kid,
  };

  const payload = {
    jti: new Date().getTime().toString(), 
    sub: clientId,
    iss: clientId,
    aud: aud,
    exp: Math.floor(Date.now() / 1000) + 300, 
  };

  // Sign the token using RS256 algorithm and private key
  return jwt.sign(payload, privateKey, { algorithm: "RS256", header });
}

async function getBearerToken() {
  const jwtToken = generateJwtToken();

  const data = new URLSearchParams({
    grant_type: process.env.grant_type,
    scope: process.env.scope, 
    client_id: clientId,
    client_assertion_type: process.env.client_assertion_type,
    client_assertion: jwtToken,
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };

  try {
    const response = await axios.post(tokenUrl, data.toString(), { headers });
    console.log("Bearer Token Response:", response.data);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching bearer token:", error.response?.data || error.message);
    throw error;
  }
}

// Execute the process
// (async () => {
//   try {
//     const bearerToken = await getBearerToken();
//     console.log("Generated Bearer Token:", bearerToken);
//   } catch (error) {
//     console.error("Failed to generate bearer token:", error);
//   }
// })();



function verifyAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  try {
    
    const publicKey = process.env.publicKey; 
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    req.user = decoded;

   
    next();
  } catch (error) {
    console.error("Invalid or expired token:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}




module.exports = { getBearerToken,verifyAccessToken };