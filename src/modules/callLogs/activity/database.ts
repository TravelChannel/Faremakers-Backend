import * as sql from 'mssql';

export async function createPool() {
  try {
    const pool = await sql.connect({
      user: 'fare',
      password: 'F@remakers786',
      server: 'faremakerserver.database.windows.net',
      database: 'TCCRM',
      options: {
        encrypt: true, // for Azure
      },
    });

    return pool;
  } catch (error) {
    console.error('Error creating database pool:', error);
    throw error;
  }
}
