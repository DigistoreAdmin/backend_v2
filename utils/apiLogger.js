const ApiLog = require("../db/models/urlHistory");

const apiLoggerMiddleware = async (req, res, next) => {
  const originalSend = res.send.bind(res);

  res.send = async function (body) {
    const statusCode = res.statusCode;

    let formattedResponse;
    try {
      formattedResponse = JSON.parse(body);
    } catch (error) {
      formattedResponse = body;
    }
    await ApiLog.create({
      route: req.originalUrl,
      response: formattedResponse,
      statusCode,
    });

    return originalSend(body); 
  };

  next();
};



module.exports = apiLoggerMiddleware;
