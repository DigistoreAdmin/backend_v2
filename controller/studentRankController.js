// --------------------STORED PROCEDURE IMPLEMENTATION--------------------//

const sequelize = require("../config/database");
const student = require("../db/models/student");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getStudentRanks = catchAsync(async (req, res, next) => {
    const { email } = req.user;

    // Fetch the student record
    const currentStudent = await student.findOne({ where: { email } });

    if (!currentStudent) {
        return res.status(404).json({ message: 'Student not found' });
    }

    const { teamId } = currentStudent;

    if (!teamId) {
        return res.status(400).json({ message: 'Team ID not found for the student' });
    }

    // Call the stored procedure using Sequelize
    const result = await sequelize.query(
        'SELECT * FROM get_team_rank(:teamId)',
        {
            replacements: { teamId },
            type: sequelize.QueryTypes.SELECT
        }
    );

    // Check if the team is onboarded
    const teamData = result.find(team => team.onBoardedPersonId === teamId);
    if (!teamData) {
        return res.status(200).json({
            message: 'No franchises onboarded by this team',
            totalOnboarded: 0,
            rank: null,
        });
    }

    // Return the result
    return res.status(200).json({
        message: 'Team rank fetched successfully',
        totalOnboarded: teamData.franchisecount,
        rank: teamData.teamrank,
    });
});


//college rank
const getCollegeRank = catchAsync(async (req, res, next) => {
    // Get the user from the request object
    const user = req.user;
    if (!user) {
        return next(new AppError("User not found", 401));
    }

    let studentData;
    try {
        // Fetch student data by email
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

    const { collegeName } = studentData; // Extract collegeName from the student data
    console.log("collegeName: ", collegeName);

    try {
        // Call the stored procedure using Sequelize
        const result = await sequelize.query('SELECT * FROM get_college_rank()', {
            type: sequelize.QueryTypes.SELECT, // Execute as SELECT query
        });

        // Find the rank of the current student's college
        const filteredRank = result.find(
            (item) => item.collegename === collegeName
        );

        res.status(200).json({
            status: "success",
            message: "College rank fetched successfully",
            collegeRank: filteredRank.rank || null,
            totalOnboarded: filteredRank.franchisesonboarded || 0,
        });
    } catch (error) {
        console.error("Error fetching ranking:", error);
        return next(new AppError("Database error while fetching ranking", 500));
    }
});


module.exports = { getStudentRanks, getCollegeRank };
