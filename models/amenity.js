const pool = require("../db");

async function findAll(){
  const [rows] = await pool.query("SELECT * FROM amenities ORDER BY name ASC");
  return rows;
}

async function create({ name, icon, description }){
  await pool.query(
    `INSERT INTO amenities (name, icon, description) VALUES (:name, :icon, :description)`,
    { name, icon, description }
  );
}

module.exports = { findAll, create };