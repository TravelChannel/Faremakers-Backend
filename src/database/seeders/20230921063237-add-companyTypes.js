'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Seed data for the Users table
    return queryInterface.bulkInsert('Users', [
      {
        id: 1,
        username: 'SuperAdmin',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'fm@gmail.com',
        password:
          '$2b$10$D63DlSZeS1tTPGvvITCoLO7KgWbtLy79ZVG.pueRGRYMy27iMJwfu',
        contact: '03401523467',
        imgSrc:
          'http://localhost:5000/uploads/users/profiles/20230916110923075.png',
        isActive: 1,
        createdAt: new Date('2023-08-25T11:44:08.011Z'),
        updatedAt: new Date('2023-09-16T11:09:23.088Z'),
      },
      {
        id: 20,
        username: 'travel',
        firstName: 'travel',
        lastName: 'admin',
        email: 'travel@gmail.com',
        password:
          '$2b$10$uiNhe6w48ke/5H7h/PRXT.FsNSTZhAxjKChwO2jVkt8PKCHlB.iAa',
        contact: '32432424242424',
        imgSrc:
          'http://localhost:5000/uploads/users/profiles/20230916103631896.png',
        isActive: 1,
        createdAt: new Date('2023-09-12T12:39:11.518Z'),
        updatedAt: new Date('2023-09-19T05:51:58.938Z'),
      },
      // Add other user data here
    ]);
  },

  async down(queryInterface) {
    // Remove all data from the Users table
    return queryInterface.bulkDelete('Users', null, {});
  },
};
