"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "passportOffice",
      [
        {
          place: "Alappuzha",
          zone: "Cochin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Aluva",
          zone: "Cochin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Kottayam",
          zone: "Cochin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Thrissur",
          zone: "Cochin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Tripunithura",
          zone: "Cochin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Chengannur",
          zone: "Cochin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Kattappana",
          zone: "Cochin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Kavaratti",
          zone: "Cochin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Nenmara",
          zone: "Cochin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Palakkad",
          zone: "Cochin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Kollam",
          zone: "Trivandrum",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Pathanamthitta",
          zone: "Trivandrum",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Trivandrum",
          zone: "Trivandrum",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Kozhikode",
          zone: "Kozhikode",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Kannur",
          zone: "Kozhikode",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Malappuram",
          zone: "Kozhikode",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Payyanur",
          zone: "Kozhikode",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Vadakara",
          zone: "Kozhikode",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          place: "Kasaragod",
          zone: "Kozhikode",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("passportOffice", null, {});
  },
};
