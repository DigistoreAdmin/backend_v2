const bcrypt = require('bcrypt');

module.exports = {
    up: (queryInterface, Sequelize) => {
        let password = process.env.ACCOUNTANT_PASSWORD;
        const hashPassword = bcrypt.hashSync(password, 10);
        return queryInterface.bulkInsert('user', [
            {
                userType: 'accountant',
                phoneNumber: "7306255375",
                email: process.env.ACCOUNTANT_EMAIL,
                password: hashPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user', { userType: 'accountant' }, {});
    },
};
