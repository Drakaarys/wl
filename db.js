const mysql = require("mysql2/promise");

const DB_NAME = process.env.DB_NAME || "wanderlust";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "";
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT || 3306;

const pool = mysql.createPool({
    host: '127.0.0.1',      // same as in MySQL Workbench
    user: 'root',           // same username
    password: 'whaibro@7', // 🔑 put your actual MySQL password here
    database: 'travel',     // or whatever your schema/database name is
    port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

module.exports = pool;


