'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Branches', 'cityId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'Cities', // The name of the referenced table
        key: 'id', // The name of the referenced column in the Cities table
      },
      onUpdate: 'NO ACTION', // Optional: cascade updates
      onDelete: 'NO ACTION', // Optional: cascade deletes
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Branches', 'cityId');
  },
};
