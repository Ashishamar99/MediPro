import knex from 'knex'
const
  config = {
    client: 'mysql',
    connection: {
      connectionString: process.env.DB_CONNECTION_STRING,
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    }
  }

export default knex(config)