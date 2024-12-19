const  payoutImpsUser  = require("../../db/models/payoutimpsuser"); 
const {getBearerToken} = require("./token"); 
const bcrypt = require("bcrypt"); 


const loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Phone number and password are required." });
    }

    
    const user = await payoutImpsUser.findOne({ where: { phoneNumber } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid phone number or password." });
    }

    // Generate token for the user
    const token = await getBearerToken();

    // Respond with the token
    return res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "An error occurred. Please try again later." });
  }
};

module.exports = { loginUser };
