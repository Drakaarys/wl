const pool = require("../db");

async function findByUsername(username){
  const [rows] = await pool.query("SELECT * FROM users WHERE username = :username", { username });
  return rows[0] || null;
}

async function findById(id){
  const [rows] = await pool.query("SELECT * FROM users WHERE id = :id", { id });
  return rows[0] || null;
}

async function createUser({ username, email, passwordHash }){
  const [res] = await pool.query(
    "INSERT INTO users (username, email, passwordHash) VALUES (:username, :email, :passwordHash)",
    { username, email, passwordHash }
  );
  return { id: res.insertId, username, email, passwordHash };
}

module.exports = { findByUsername, findById, createUser };