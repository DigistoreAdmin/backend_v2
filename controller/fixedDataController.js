const { Sequelize } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Operator = require("../db/models/operator");
const axios = require("axios");
const sequelize = require("../config/database");
const Circles = require("../db/models/circle");






const rechargePage = catchAsync(async (req, res, next) => {
  const data = await Operator.findAll();
  if (!data) {
    return next(new AppError("Failed fetch data ", 400));
  }

  return res.status(200).json({ data: data, message: "success" });
});


const circle = catchAsync(async (req, res, next) => {
  try {
    const data = await Circles.findAll();
    console.log("data", data);
    return res.status(200).json({ data: data, count: data.length });
  } catch (error) {
    console.error("Error fetching circle data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


const fetchMobileRechargePlans = catchAsync(async (req, res, next) => {
  const { operator_id, circle_id, recharge_type } = req.query;

  // Construct the URL based on the presence of query parameters
  let apiUrl = `https://api.datayuge.com/v7/rechargeplans/?apikey=${process.env.DATAYUGE_API_KEY}`;

  if (operator_id) {
    apiUrl += `&operator_id=${operator_id}`;
  }
  if (circle_id) {
    apiUrl += `&circle_id=${circle_id}`;
  }
  if (recharge_type) {
    apiUrl += `&recharge_type=${recharge_type}`;
  }

  try {
    const response = await axios.get(apiUrl);
    // console.log("res", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Failed to fetch recharge plans" });
  }
});


module.exports = {
  rechargePage,
  fetchMobileRechargePlans,
  circle
};
