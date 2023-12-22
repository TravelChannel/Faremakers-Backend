import { sequelize } from './sequelize.provider'; // Import the sequelize instance from the new file

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',

    useValue: sequelize,
  },
];
