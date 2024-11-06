const defineStaffsDetails = require("../db/models/staffs");
const WorkTime = require("../db/models/worktime");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const reassign = catchAsync(async (req, res, next) => {
  const { workId, assignedId } = req.body;

  if (!workId) {
    return res.status(400).json({ error: "workId is required" });
  }

  if (!assignedId) {
    return res.status(400).json({ error: "AssignedId is required" });
  }

  const Staff = defineStaffsDetails();

  const staffExists = await Staff.findOne({
      where: { employeeId: assignedId },
    });
 
  const staffName=staffExists.firstName
  console.log('staffName: ', staffName);

  if (!staffExists) {
    return next(new AppError("Staff not found", 404));
  }

  const workIdExist = await WorkTime.findOne({
    where: { workId },
  });

  if (!workIdExist) {
    return next(new AppError("WorkId not found", 404));
  }

  const updatedReassignedTime = [...(workIdExist.reassignedTime || []), new Date()];
  const updatedStaffNames = [...(workIdExist.staffName || []), staffName];

  await WorkTime.update(
    { reassigned: true, reassignedTime: updatedReassignedTime ,  staffName: updatedStaffNames},
    { where: { workId } }
  );

  

  res.status(200).json({
    status: "success",
    message: "Staff reassigned successfully",
  });
});

module.exports = { reassign };
