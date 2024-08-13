const bcrypt = require('bcrypt');

module.exports = {
    up: (queryInterface, Sequelize) => {
        let password = process.env.ADMIN_PASSWORD;
        const hashPassword = bcrypt.hashSync(password, 10);
        return queryInterface.bulkInsert('user', [
            {
                userType: 'admin',
                phoneNumber: "8606172633",
                email: process.env.ADMIN_EMAIL,
                password: hashPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user', { userType: 'admin' }, {});
    },
};
