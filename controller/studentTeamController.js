const Student = require("../db/models/student");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Sequelize } = require("sequelize");

const bestTeam = catchAsync(async (req, res, next) => {
  const result = await Student.findAll({
    attributes: [
      "teamId",
      [Sequelize.fn("COUNT", Sequelize.col("teamId")), "count"],
    ],
    group: ["teamId"],
    order: [[Sequelize.literal("count"), "DESC"]],
    limit: 1,
  });

  if (!result || result.length === 0) {
    return next(new AppError("No teams found", 404));
  }

  console.log(result);
  return res.status(200).json({
    status: "success",
    data: {
      teamID: result[0].teamId,
      count: result[0].dataValues.count,
    },
  });
});

module.exports = { bestTeam };
