require('dotenv').config();
const base = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'postgres',
};
module.exports = {
  development: { ...base, database: process.env.DB_NAME || 'movie_app' },
  test: { ...base, database: `${process.env.DB_NAME || 'movie_app'}_test`, logging: false },
  production: process.env.DATABASE_URL
    ? {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        logging: false,
        dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      }
    : { ...base, database: process.env.DB_NAME, logging: false },
};
