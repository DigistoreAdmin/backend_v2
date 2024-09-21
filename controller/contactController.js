const catchAsync = require("../utils/catchAsync");
const Contacts = require("../db/models/contacts");
const AppError = require("../utils/appError");

const createContact = catchAsync(async (req, res, next) => {
  try {
    const { fullName, email, subject, phoneNumber, enquiryMessage } = req.body;
    const newContact = await Contacts.create({
      fullName,
      email,
      subject,
      phoneNumber,
      enquiryMessage,
    });

    if (!newContact) {
      throw new AppError("Failed to create contacts", 400);
    }

    return res.json({
        status: "success",
        message: "Contact created successfully",
        data: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { createContact };
