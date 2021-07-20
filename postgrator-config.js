require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_END === 'test')
    ? process.env.TEST_DB_URL
    : process.env.DB_URL
}