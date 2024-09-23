const student = require("../db/models/student");
const franchise = require("../db/models/franchise");
const AppError = require("../utils/appError");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");

const getCollegeRank = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new AppError("User not found", 401));
  }

  let studentData;
  try {
    studentData = await student.findOne({
      where: { email: user.email },
    });
  } catch (error) {
    return next(
      new AppError("Database error while fetching student data", 500)
    );
  }

  if (!studentData) {
    return next(new AppError("Student not found", 404));
  }

  const { teamId, collegeId, collegeName } = studentData; // Extract collegeName here
  if (!teamId || !collegeId) {
    return res.status(404).json({
      status: "fail",
      message: "Team ID or College ID not found",
    });
  }

  console.log("teamId=", teamId);
  console.log("collegeId=", collegeId);

  try {
    console.log("Fetching franchise ranking based on onBoardedPersonId...");

    const collegeQuestData = await franchise.findAll({
      where: {
        onBoardedBy: "collegeQuest",
      },
    });

    console.log(collegeQuestData);

    const nameCounts = collegeQuestData.reduce((acc, obj) => {
      acc[obj.onBoardedPersonName] = (acc[obj.onBoardedPersonName] || 0) + 1;
      return acc;
    }, {});

    const rankedNames = Object.entries(nameCounts)
      .map(([collegeName, franchisesOnboarded]) => ({
        collegeName,
        franchisesOnboarded,
      }))
      .sort((a, b) => b.franchisesOnboarded - a.franchisesOnboarded);

    const rankedWithPositions = rankedNames.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    console.log(rankedWithPositions);

    const filteredRank = rankedWithPositions.find(
      (item) => item.collegeName === collegeName
    );

    res.status(200).json({
      status: "success",
      message: "College rank",
      filteredRank: filteredRank || null,
    });
  } catch (error) {
    console.error("Error fetching ranking:", error);
    return next(new AppError("Database error while fetching ranking", 500));
  }
});

module.exports = { getCollegeRank };
