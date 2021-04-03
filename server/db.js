const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: 1433,

  stream: false,
  pool: {
    max: 90,
    min: 0,
    idleTimeoutMillis: 900000,
  },
  requestTimeout: 0,
  connectionTimeout: 3000,
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
}

module.exports = dbConfig
