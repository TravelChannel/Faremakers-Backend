'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Test v ui
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('CompanyBranches', 'branchCode', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'None',
      });

      await queryInterface.addColumn('CompanyBranches', 'branchName', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'None',
      });
      await queryInterface.addColumn('CompanyBranches', 'friendlyName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      await queryInterface.addColumn('CompanyBranches', 'address', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      await queryInterface.addColumn('CompanyBranches', 'phone', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      await queryInterface.addColumn('CompanyBranches', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
      });

      return Promise.resolve();
    } catch (error) {
      console.error('Error adding columns:', error);
      throw error; // Rethrow the error to trigger the rollback
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.removeColumn('CompanyBranches', 'BranchCode');
      await queryInterface.removeColumn('CompanyBranches', 'BranchName');
      await queryInterface.removeColumn('CompanyBranches', 'FriendlyName');
      await queryInterface.removeColumn('CompanyBranches', 'Address');
      await queryInterface.removeColumn('CompanyBranches', 'Phone');
      await queryInterface.removeColumn('CompanyBranches', 'Email');

      return Promise.resolve();
    } catch (error) {
      console.error('Error reverting columns:', error);
      throw error; // Rethrow the error to trigger the rollback
    }
  },
};
