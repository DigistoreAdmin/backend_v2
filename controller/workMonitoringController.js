const workTime = require("../db/models/worktime");
const defineStaff = require("../db/models/staffs");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const staffWorkTime = catchAsync(async (req, res, next) => {
  try {
    const { workId, status } = req.body;

    if (!workId) {
      return res.status(400).json({ error: "workId is required" });
    }

    const user = req.user;
    const Staff = defineStaff();

    const staffExists = await Staff.findOne({
      where: { email: user.email },
    });

    if (!staffExists) {
      return next(new AppError("Staff not found", 404));
    }

    const workIdExist = await workTime.findOne({
      where: { workId },
    });

    if (!workIdExist) {
      const workTimeInstance = await workTime.create({
        workId,
        employeeRecords: [
          {
            staffName: staffExists.firstName,
            startTime: new Date(),
          },
        ],
      });
      return res.status(201).json({ workTimeInstance });
    }

    const targetRecord = workIdExist.employeeRecords.find(
      (record) => record.staffName === staffExists.firstName
    );
    
    const staffRecordIndex = workIdExist.employeeRecords.findIndex(
      (record) => record.staffName === staffExists.firstName
    );
    
    if (
      targetRecord?.staffName === staffExists.firstName &&
      targetRecord?.reassigned === true &&
      targetRecord?.assignedId === staffExists.employeeId &&
      !targetRecord?.startTime
    ) {
      const updatedRecords = workIdExist.employeeRecords.map((record, index) => {
        if (index === staffRecordIndex) {
          return {
            ...record,
            startTime: new Date(),
          };
        }
        return record;
      });
    
      await workIdExist.update({
        employeeRecords: updatedRecords,
      });
    }
    

    if(status ==="breakStarted"){
      const updatedRecords = workIdExist.employeeRecords.map((record,index) => {
          if (index === staffRecordIndex) {
              return {
                  ...record,
                  breakTimeStarted: [...(record.breakTimeStarted || []), new Date()],
              };
          }
          return record;
      });
  
      await workIdExist.update({
          employeeRecords: updatedRecords,
      });
  
      return res
          .status(200)
          .json({ message: "Work time marked as completed", workIdExist });
  }

  if (status === "breakEnded") {
    const updatedRecords = workIdExist.employeeRecords.map((record,index) => {
    if (index === staffRecordIndex) {
        const breakTimeEnded = [...(record.breakTimeEnded || []), new Date()];
        const breakTime = (record.breakTime || []).slice();

        if (record.breakTimeStarted && record.breakTimeStarted.length > 0) {
        const lastBreakStartIndex = record.breakTimeStarted.length - 1;
        const breakDuration = new Date(breakTimeEnded[breakTimeEnded.length - 1]) - new Date(record.breakTimeStarted[lastBreakStartIndex]);
        const formatedDuration=formatDuration(breakDuration)
        breakTime.push(formatedDuration);
        }

        const totalBreakTimeInMilliSec = breakTime.reduce((total, duration) => total + parseDuration(duration), 0);
        const totalBreakTime = formatDuration(totalBreakTimeInMilliSec);

        return {
        ...record,
        breakTimeEnded,
        breakTime,
        totalBreakTime              
        };
    }
    return record;
    });

    await workIdExist.update({
    employeeRecords: updatedRecords,
    });

    return res.status(200).json({ message: "Break time ended", workIdExist });
}

    if (status === "completed") {
      const updatedRecords = workIdExist.employeeRecords.map((record,index) => {
          if (index === staffRecordIndex && !record.endTime) {
              const endTime=new Date()
              const startTime = new Date(record.startTime)
              const workDuration= endTime - startTime
              const totalTimeTaken = formatDuration(workDuration)
          return {
              ...record,
              endTime: new Date(),
              totalTimeTaken
          };
          }
          return record;
      });

      await workIdExist.update({
          employeeRecords: updatedRecords,
      });

      return res
          .status(200)
          .json({ message: "Work time marked as completed", workIdExist });
      }

    return res.status(200).json({ workIdExist });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

const formatDuration = (milliseconds) => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  return `${hours}h:${minutes}m:${seconds}s`;
};

const parseDuration = (formattedTime) => {
  const [hours, minutes, seconds] = formattedTime
    .split(/[hms:]+/)
    .map(Number);
  return hours * 3600000 + minutes * 60000 + seconds * 1000;
};

module.exports = { staffWorkTime };
