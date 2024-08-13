const { Sequelize } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const TransationHistory = require("../db/models/transationhistory");
const transationHistories = require("../db/models/transationhistory");
const Franchise = require("../db/models/franchise");




const transationHistoryAdmin = catchAsync(async (req, res, next) => {
  try {
    const data = await TransationHistory.findAll();
    // const data = await TransationHistory.findAll({
    //   order: [['createdAt', 'DESC']] // or use [['id', 'DESC']] if ordering by ID
    // });
    console.log("data", data);
    return res.status(200).json({ data: data, count: data.length });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const transactionHistoryFranchise = catchAsync(async (req, res, next) => {
  try {
    const user = req.user;

    const Data = await Franchise.findOne({ where: { email: user.email } });
    if (!Data) {
      return res.status(404).json({ message: "Franchise not found" });
    }
    // console.log("Franchise ID:", Data.id);
    const data = await transationHistories.findAll({
      where: { uniqueId: Data.franchiseUniqueId },
    });

    console.log("Matching transactionHistories records of franchise", data);

    return res.status(200).json({ data: data,count:data.length });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = {
  transationHistoryAdmin,
  transactionHistoryFranchise
}