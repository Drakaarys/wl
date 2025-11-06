const pool = require("../db");

async function create({ comment, rating, ListingId, authorId }){
  const [res] = await pool.query(
    `INSERT INTO reviews (comment, rating, ListingId, authorId) VALUES (:comment, :rating, :ListingId, :authorId)`,
    { comment, rating, ListingId, authorId }
  );
  const [rows] = await pool.query("SELECT * FROM reviews WHERE id = :id", { id: res.insertId });
  return rows[0];
}

async function destroy(id){
  await pool.query("DELETE FROM reviews WHERE id = :id", { id });
}

async function findByPk(id){
  const [rows] = await pool.query("SELECT * FROM reviews WHERE id = :id", { id });
  return rows[0] || null;
}

module.exports = { create, destroy, findByPk };