const { Sequelize } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const Franchise = require("../db/models/franchise");
const userPlans = require("../db/models/userplan");

const userPlan = catchAsync(async (req, res, next) => {
  const body = req.body;
  const { id, selectedPlan } = req.body;
  console.log(id, selectedPlan);

  const franchise = await Franchise.findOne({
    where: { franchiseUniqueId: body.id },
  });

  if (!franchise) {
    return next(new AppError("Franchise not found", 404));
  }

  const data = await userPlans.findOne({ where: { planId: body.id } });

  if (data) {
    return next(new AppError("userPlan already created ", 404));
  }

  if (body.selectedPlan !== "free" && body.selectedPlan !== "paid") {
    return next(new AppError("Invalid plan selected", 400));
  }

  if (body.selectedPlan === "paid") {
    const requiredFields = [
      "modeOfPayment",
      "amountCollected",
      // "discount",
      "collectedBy",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return next(
          new AppError(`${field} is required for the 'paid' plan`, 400)
        );
      }
    }
  }

  const updated = await Franchise.update(
    { userPlan: selectedPlan },
    { where: { franchiseUniqueId: id } }
  );

  const plan = await userPlans.create({
    planType: body.selectedPlan,
    modeOfPayment: body.modeOfPayment,
    amountCollected: body.amountCollected,
    discount: body.discount,
    collectedBy: body.collectedBy,
    planId: franchise.franchiseUniqueId,
  });

  if (updated && plan) {
    return res
      .status(201)
      .json({ status: "success", message: "Plan selected successfully" });
  }
});

module.exports = {
  userPlan,
};
