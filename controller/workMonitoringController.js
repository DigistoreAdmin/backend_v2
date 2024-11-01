const workTime = require("../db/models/workTIme");
const catchAsync = require("../utils/catchAsync");

const staffWorkTime = catchAsync(async (req, res, next) => {
  try {
    const { workId, status } = req.body;

    const workIdExist = await workTime.findOne({
      where: { workId },
    });

    if (!workIdExist) {
      const workTimeInstance = await workTime.create({
        workId,
        startTime: new Date(),
      });
      return res.status(201).json({ workTimeInstance });
    }

    if (status === "completed") {
  const endTime = new Date();
  const totalWorkTimeWithoutBreak = endTime - workIdExist.startTime;

  const hoursTaken1 = Math.floor(totalWorkTimeWithoutBreak / (1000 * 60 * 60));
  const minutesTaken1 = Math.floor((totalWorkTimeWithoutBreak % (1000 * 60 * 60)) / (1000 * 60));
  const secondsTaken1 = Math.floor((totalWorkTimeWithoutBreak % (1000 * 60)) / 1000);

  let hoursBreak = 0, minutesBreak = 0, secondsBreak = 0;
  if (workIdExist.totalBreakTime && typeof workIdExist.totalBreakTime === 'string') {
    const breakTimeParts = workIdExist.totalBreakTime.match(/(\d+)\s*h|(\d+)\s*m|(\d+)\s*s/g);

    if (breakTimeParts) {
      breakTimeParts.forEach(part => {
        const num = parseInt(part.match(/\d+/)[0], 10);
        if (part.includes('h')) {
          hoursBreak = num;
        } else if (part.includes('m')) {
          minutesBreak = num;
        } else if (part.includes('s')) {
          secondsBreak = num;
        }
      });
    }
  }

  const totalSecondsTaken = hoursTaken1 * 3600 + minutesTaken1 * 60 + secondsTaken1;
  const totalSecondsBreak = hoursBreak * 3600 + minutesBreak * 60 + secondsBreak;

  const totalSeconds = totalSecondsTaken - totalSecondsBreak;

  const finalHours = Math.floor(totalSeconds / 3600);
  const finalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const finalSeconds = totalSeconds % 60;

  const totalTimeWithoutBreak = `${finalHours}h ${finalMinutes}m ${finalSeconds}s`;

  let totalTimeWithBreak;
  if (workIdExist.breakTimeStarted) {
    const totalWorkTimeWithBreak = endTime - workIdExist.startTime;

    const hoursTaken2 = Math.floor(totalWorkTimeWithBreak / (1000 * 60 * 60));
    const minutesTaken2 = Math.floor((totalWorkTimeWithBreak % (1000 * 60 * 60)) / (1000 * 60));
    const secondsTaken2 = Math.floor((totalWorkTimeWithBreak % (1000 * 60)) / 1000);

    totalTimeWithBreak = `${hoursTaken2}h ${minutesTaken2}m ${secondsTaken2}s`;
  }

  const workComplete = await workTime.update(
    {
      endTime: endTime,
      totalWorkTimeWithoutBreak: totalTimeWithoutBreak,
      totalWorkTimeWithBreak: totalTimeWithBreak,
    },
    { where: { workId: workIdExist.workId } }
  );

  if (!workComplete) {
    return res.status(400).json({ message: "Failed to update work time" });
  }

  const workCompleted = await workTime.findOne({
    where: { workId: workIdExist.workId },
  });

  return res.status(200).json({ workCompleted });
}



    return res.status(200).json({ workIdExist });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

const breakTime = catchAsync(async (req, res, next) => {
  try {
    const { workId, status } = req.body;

    const workIdExist = await workTime.findOne({
      where: { workId },
    });

    if (!workIdExist) {
      return res.status(400).json({ message: "WorkId not found" });
    }

    let breakTimeStarted;
    let breakTimeEnded;
    let totalBreakTime = workIdExist.totalBreakTime || "0h 0m 0s";
    let totalBreakMilliseconds = breakTimeToMilliseconds(totalBreakTime);

    if (status === "breakStarted") {
      breakTimeStarted = new Date();
    }

    if (status === "breakEnded") {
      breakTimeEnded = new Date();
      const breakTimeTaken = breakTimeEnded - workIdExist.breakTimeStarted;

      totalBreakMilliseconds += breakTimeTaken;

      const newBreakTime = millisecondsToBreakTime(totalBreakMilliseconds);
      totalBreakTime = newBreakTime;
    }

    await workTime.update(
      {
        breakTimeStarted: breakTimeStarted,
        breakTimeEnded: breakTimeEnded,
        totalBreakTime: totalBreakTime,
      },
      {
        where: { workId: workIdExist.workId },
      }
    );

    const workTimeUpdated = await workTime.findOne({
      where: { workId: workIdExist.workId },
    });

    return res.status(200).json({ workTimeUpdated });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

function breakTimeToMilliseconds(breakTime) {
  const timeParts = breakTime.match(/(\d+)h (\d+)m (\d+)s/);
  if (!timeParts) return 0;

  const hours = parseInt(timeParts[1]) || 0;
  const minutes = parseInt(timeParts[2]) || 0;
  const seconds = parseInt(timeParts[3]) || 0;

  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}

function millisecondsToBreakTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}



module.exports = { staffWorkTime, breakTime };
