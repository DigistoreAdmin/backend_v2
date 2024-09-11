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

const bestTeamInCollege = catchAsync(async (req, res, next) => {
  
    try {
        
        const {collegeId} = req.body

        const college = await Student.findOne({
            where: { collegeId }
        })

        if(!college){
            return next(new AppError("College not found", 404));
        }

        const result = await Student.findAll({
            where: {collegeId},
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
        
          return res.status(200).json({
            status: "success",
            data: {
              teamID: result[0].teamId,
              count: result[0].dataValues.count,
            },
          });

    } catch (error) {
        console.log("error", error.message)

      return res
      .status(500)
      .json({
        status: "error",
        message: "An error occurred while getting the best team",
      });
    }

});

const bestCollege = catchAsync(async (req,res,next) => {

    try {

        const result = await Student.findAll({
            attributes: [
                "collegeId","collegeName",
                [Sequelize.fn("COUNT", Sequelize.col("collegeId")), "count"],
            ],
            group: ["collegeId","collegeName"],
            order: [[Sequelize.literal("count"), "DESC"]],
            limit:1,
        })

        if(!result || result.length === 0){
            return next(new AppError("No teams found", 404));
        }

        return res.status(200).json({
            status: "success",
            data: result
        })
        
    } catch (error) {
        
        console.log("error", error.message)

        return res
        .status(500)
        .json({
            status: "error",
            message: "An error occured while getting the best College"
        })
    }

})

module.exports = { bestTeamInCollege, bestCollege, bestTeam };