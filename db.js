const mysql = require("mysql2/promise");

const DB_NAME = process.env.DB_NAME || "travel";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "whaibro@7";
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT || 3306;

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

module.exports = pool;


