'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users');

    if (!table.email) {
      await queryInterface.addColumn('Users', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });
    }

    if (!table.password) {
      await queryInterface.addColumn('Users', 'password', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.isVerified) {
      await queryInterface.addColumn('Users', 'isVerified', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    if (!table.requestedRole) {
      await queryInterface.addColumn('Users', 'requestedRole', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.roleId) {
      await queryInterface.addColumn('Users', 'roleId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }

    if (!table.biodateId) {
      await queryInterface.addColumn('Users', 'biodateId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Biodates',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('Users');

    if (table.biodateId) {
      await queryInterface.removeColumn('Users', 'biodateId');
    }

    if (table.roleId) {
      await queryInterface.removeColumn('Users', 'roleId');
    }

    if (table.requestedRole) {
      await queryInterface.removeColumn('Users', 'requestedRole');
    }

    if (table.isVerified) {
      await queryInterface.removeColumn('Users', 'isVerified');
    }

    if (table.password) {
      await queryInterface.removeColumn('Users', 'password');
    }

    if (table.email) {
      await queryInterface.removeColumn('Users', 'email');
    }
  },
};
