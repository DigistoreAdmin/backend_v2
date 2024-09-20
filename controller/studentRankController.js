const sequelize = require("../config/database");
const { Op } = require('sequelize')
const Franchise = require("../db/models/franchise");
const student = require("../db/models/student");
const catchAsync = require("../utils/catchAsync");

const getStudentRanks = catchAsync(async (req, res, next) => {
    const { email } = req.user;

    const currentStudent = await student.findOne({ where: { email } });

    if (!currentStudent) {
        return res.status(404).json({ message: 'Student not found' });
    }

    const { teamId } = currentStudent;

    if (!teamId) {
        return res.status(400).json({ message: 'Team ID not found for the student' });
    }

    const teamFranchiseCount = await Franchise.count({
        where: { onBoardedPersonId: teamId },
    });

    if (teamFranchiseCount === 0) {
        return res.status(200).json({
            message: 'No franchises onboarded by this team',
            totalOnboarded: 0,
            rank: null,
        });
    }

    const teamsRankData = await Franchise.findAll({
        attributes: [
            'onBoardedPersonId',
            [sequelize.fn('COUNT', sequelize.col('id')), 'franchiseCount']
        ],
        where: {
            onBoardedPersonId: {
                [Op.ne]: null,
                [Op.ne]: ''
            }
        },
        group: ['onBoardedPersonId'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    });

    // return res.json({ teamsRankData })

    const rank = teamsRankData.findIndex(team => team.onBoardedPersonId === teamId) + 1;

    return res.status(200).json({
        message: 'Team rank fetched successfully',
        totalOnboarded: teamFranchiseCount,
        rank,
    });
});

module.exports = { getStudentRanks };
