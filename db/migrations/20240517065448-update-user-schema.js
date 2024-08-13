'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // await queryInterface.removeColumn('user', 'firstName');
        // await queryInterface.removeColumn('user', 'lastName');
        await queryInterface.addColumn('user', 'phoneNumber', {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                isNumeric: {
                    msg: 'Phone number must contain only numbers',
                },
                len: {
                    args: [10, 15],
                    msg: 'Phone number must be between 10 and 15 digits',
                },
            },
        });
        await queryInterface.changeColumn('user', 'userType', {
            type: Sequelize.ENUM('admin', 'distributor', 'franchise'),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'userType cannot be null',
                },
                notEmpty: {
                    msg: 'userType cannot be empty',
                },
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        // await queryInterface.addColumn('user', 'firstName', {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        //     validate: {
        //         notNull: {
        //             msg: 'firstName cannot be null',
        //         },
        //         notEmpty: {
        //             msg: 'firstName cannot be empty',
        //         },
        //     },
        // });
        // await queryInterface.addColumn('user', 'lastName', {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        //     validate: {
        //         notNull: {
        //             msg: 'lastName cannot be null',
        //         },
        //         notEmpty: {
        //             msg: 'lastName cannot be empty',
        //         },
        //     },
        // });
        await queryInterface.removeColumn('user', 'phoneNumber');
        await queryInterface.changeColumn('user', 'userType', {
            type: Sequelize.ENUM('0', '1', '2'),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'userType cannot be null',
                },
                notEmpty: {
                    msg: 'userType cannot be empty',
                },
            },
        });
    }
};
