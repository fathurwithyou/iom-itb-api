'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const email = 'admin@local.test';
    const hashedPassword = await bcrypt.hash('admin12345', 10);
    const existingAdminId = await queryInterface.rawSelect(
      'Admins',
      { where: { email } },
      ['id']
    );

    if (existingAdminId) {
      await queryInterface.bulkUpdate(
        'Admins',
        {
          password: hashedPassword,
          approved: true,
          updatedAt: new Date(),
        },
        { id: existingAdminId }
      );
      return;
    }

    await queryInterface.bulkInsert('Admins', [
      {
        email,
        password: hashedPassword,
        approved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Admins', { email: 'admin@local.test' });
  },
};
