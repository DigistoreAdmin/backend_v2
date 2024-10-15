const jwt = require("jsonwebtoken");
const TokenModel = require("../db/models/token");
const { sendErrorResponse, sendOkResponse } = require("./utils");
const AppError = require("../utils/appError");
const Franchise = require("../db/models/franchise");


// const { TOKEN_NOTFOUND, TOKEN_EXPIED_ERROR } = require("../constants/constants");

const generateTokens = async (user) => {
  try {
    const { email, userType } = user;

    const payload = { email, userType };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "1d" }
      // // for testing
      // { expiresIn: "1m" }  // Token expires in 1 minute
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: "30d" }
      // // for testing
      // { expiresIn: "2m" }  // Token expires in 1 minute
    );

    await TokenModel.create({ refreshToken: refreshToken, email: email });

    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};



const verifyToken = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  // if (authHeader==undefined) {
  //   res.status(401).send({error:"no token provided"})
  // }
  // const token = authHeader && authHeader.split(' ')[1];

  // if (!token) {
  //   return sendErrorResponse(res,401,TOKEN_NOTFOUND)
  // }

  const authHeader = req.headers["cookie"];
  const accessSplit = authHeader && authHeader.split("accessToken=")[1];
  const token = accessSplit && accessSplit.split(";")[0];
  // const refreshToken = authHeader && authHeader.split("refreshToken=")[1];
  if (!token) {
    return res.status(403).json({message:'No token provided'})
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        req.isAccessTokenExpired = true;
        return next(); // Forward to next middleware
      }
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    console.log("ok");
    req.user = user;
    console.log("jii", user.userType);
    next();
  });
};



const verifyRefreshToken = async (req, res, next) => {
  if (!req.isAccessTokenExpired) {
    return next(); // If access token is not expired, skip this middleware
  }


  const authHeader = req.headers["cookie"];
  const refreshToken = authHeader && authHeader.split("refreshToken=")[1]?.split(";")[0];

  if (!refreshToken) {
    return next(new AppError('No token provided...', 403));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);

    // Check if the refresh token is blacklisted (optional)
    // const blacklistedToken = await Token.findOne({ where: { token: refreshToken } });
    // if (blacklistedToken) {
    //   return next(new AppError('Refresh token is blacklisted', 403));
    // }

    const storedToken = await TokenModel.findOne({ where: { refreshToken: refreshToken,email: decoded.email } });
    if (!storedToken) {
      return next(new AppError('Invalid refresh token', 403));
    }

    const newAccessToken = jwt.sign(
      { email: decoded.email, userType: decoded.userType },
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "1d" } 
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    });

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Refresh token expired', 401));
    } else {
      return next(new AppError('Failed to authenticate refresh token', 401));
    }
  }
};

// Basic Authentication Middleware

const externalServiceAuthMiddleware = async (req, res, next) => {
  console.log("BASIC_AUTH_USERNAME:", process.env.BASIC_AUTH_USERNAME);
  console.log("BASIC_AUTH_PASSWORD:", process.env.BASIC_AUTH_PASSWORD);
  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;
  const credentials = `${username}:${password}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');
  req.externalServiceData = `Basic ${encodedCredentials}`;
  console.log(`Basic ${encodedCredentials}`);
  const user = req.user;
  const Data = await Franchise.findOne({ where: { email: user.email } });
  if (Data.verified == true) {
    next();
  }else{
    return next(new AppError("Service Restricted. Contact Admin", 401));
  }
};


module.exports = { verifyToken, generateTokens,verifyRefreshToken,externalServiceAuthMiddleware };







