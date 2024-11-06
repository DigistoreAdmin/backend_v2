const workTime = require("../db/models/workTIme");
const defineStaff = require("../db/models/staffs");
const catchAsync = require("../utils/catchAsync");

const staffWorkTime = catchAsync(async (req, res, next) => {
  try {
    const { workId, status } = req.body;

    if(!workId) {
      return res.status(400).json({ error: "workId is required"})
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
        startTime: [new Date()],
        staffName: [staffExists.firstName],
        assignedId: [staffExists.employeeId],
        endTime: [],
        totalWorkTimeWithoutBreak: [],
      });
      return res.status(201).json({ workTimeInstance });
    }

    if (!workIdExist.staffName.includes(staffExists.firstName)) {
      const startTime = new Date();
      const updatedTime = [...(workIdExist.startTime || []), startTime];
      const updatedStaffName = [...(workIdExist.staffName || []), staffExists.firstName];
      const updatedAssignedId = [...(workIdExist.assignedId || []), staffExists.employeeId];

      await workIdExist.update({
        startTime: updatedTime,
        staffName: updatedStaffName,
        assignedId: updatedAssignedId,
      });

      const reassignedStaff = await workTime.findOne({
        where: { workId: workIdExist.workId },
      });

      return res.status(200).json({ reassignedStaff });
    }

    const index = workIdExist.staffName.indexOf(staffExists.firstName);

    if (status === "breakStarted") {
      const breakTimeStarted = new Date();
      const updatedBreakStart = [...(workIdExist.breakTimeStarted || []), breakTimeStarted];

      await workTime.update(
        { breakTimeStarted: updatedBreakStart },
        { where: { workId: workIdExist.workId } }
      );

      const updatedBreak = await workTime.findOne({
        where: { workId: workIdExist.workId }
      });
      return res.status(200).json({ updatedBreak });
    }

    if (status === "breakEnded") {
      const breakTimeEnded = new Date();
      const breakStartTimes = workIdExist.breakTimeStarted || [];
      const lastBreakStart = new Date(breakStartTimes[breakStartTimes.length - 1]);

      const breakDuration = breakTimeEnded - lastBreakStart;
      const hoursTaken = Math.floor(breakDuration / (1000 * 60 * 60));
      const minutesTaken = Math.floor((breakDuration % (1000 * 60 * 60)) / (1000 * 60));
      const secondsTaken = Math.floor((breakDuration % (1000 * 60)) / 1000);
      const breakDurationFormatted = `${hoursTaken}h ${minutesTaken}m ${secondsTaken}s`;

      const updatedBreakEnd = [...(workIdExist.breakTimeEnded || []), breakTimeEnded];
      const updatedTotalTime = [...(workIdExist.totalBreakTime || []), breakDurationFormatted];

      await workTime.update(
        {
          breakTimeEnded: updatedBreakEnd,
          totalBreakTime: updatedTotalTime,
        },
        { where: { workId: workIdExist.workId } }
      );

      const updatedBreak = await workTime.findOne({
        where: { workId: workIdExist.workId }
      });

      return res.status(200).json({ updatedBreak });
    }

    if (status === "completed") {
      const endTime = new Date();
      if (isNaN(endTime.getTime())) {
        return res.status(400).json({ error: 'Invalid end time' });
      }
    
      if (!workIdExist.endTime[index] || !workIdExist.totalWorkTimeWithoutBreak[index]) {
        const startTime = workIdExist.startTime[index];
        if (isNaN(new Date(startTime).getTime())) {
          return res.status(400).json({ error: 'Invalid start time' });
        }
    
        const totalTimeWithBreaks = endTime - new Date(startTime);
    
        let breakDuration = 0;
        if (workIdExist.breakTimeStarted && workIdExist.breakTimeStarted.length > 0) {
          for (let i = 0; i < workIdExist.breakTimeStarted.length; i++) {
            const breakStart = new Date(workIdExist.breakTimeStarted[i]);
            const breakEnd = new Date(workIdExist.breakTimeEnded[i]);
    
            if (isNaN(breakStart.getTime()) || isNaN(breakEnd.getTime())) {
              return res.status(400).json({ error: 'Invalid break time' });
            }
    
            if (breakStart >= new Date(startTime) && breakEnd <= endTime) {
              breakDuration += breakEnd - breakStart;
            }
          }
        }
    
        const totalTimeWithoutBreaks = totalTimeWithBreaks - breakDuration;
        const hoursTaken1 = Math.floor(totalTimeWithoutBreaks / (1000 * 60 * 60));
        const minutesTaken1 = Math.floor((totalTimeWithoutBreaks % (1000 * 60 * 60)) / (1000 * 60));
        const secondsTaken1 = Math.floor((totalTimeWithoutBreaks % (1000 * 60)) / 1000);
        const totalTimeWithoutBreak = `${hoursTaken1}h ${minutesTaken1}m ${secondsTaken1}s`;
    
        let totalTimeWithBreak = null;
        if (breakDuration > 0) {
          const hoursTaken = Math.floor(totalTimeWithBreaks / (1000 * 60 * 60));
          const minutesTaken = Math.floor((totalTimeWithBreaks % (1000 * 60 * 60)) / (1000 * 60));
          const secondsTaken = Math.floor((totalTimeWithBreaks % (1000 * 60)) / 1000);
          totalTimeWithBreak = `${hoursTaken}h ${minutesTaken}m ${secondsTaken}s`;
        }
    
        const updatedEndTime = [...(workIdExist.endTime || []), new Date(endTime)];
        const updatedTotalTimeWithoutBreak = [...workIdExist.totalWorkTimeWithoutBreak, totalTimeWithoutBreak];
        const updatedTotalTimeWithBreak = [...(workIdExist.totalWorkTimeWithBreak || []), totalTimeWithBreak];
    
        await workIdExist.update({
          endTime: updatedEndTime,
          totalWorkTimeWithoutBreak: updatedTotalTimeWithoutBreak,
          totalWorkTimeWithBreak: updatedTotalTimeWithBreak,
          totalBreakTime: workIdExist.totalBreakTime ? workIdExist.totalBreakTime : [...(workIdExist.totalBreakTime || []), totalTimeWithBreak],
        });
      }
    
      await workIdExist.save();
      return res.status(200).json({ totalWorkTimeWithBreak: workIdExist });
    }
    
    
    

    return res.status(200).json({ workIdExist });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

module.exports = { staffWorkTime };
