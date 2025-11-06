const pool = require("../db");

async function create({ ListingId, UserId, checkIn, checkOut, totalPrice }){
  const [res] = await pool.query(
    `INSERT INTO bookings (ListingId, UserId, checkIn, checkOut, totalPrice)
     VALUES (:ListingId, :UserId, :checkIn, :checkOut, :totalPrice)`,
    { ListingId, UserId, checkIn, checkOut, totalPrice }
  );
  const [rows] = await pool.query("SELECT * FROM bookings WHERE id = :id", { id: res.insertId });
  return rows[0];
}

async function findByPk(id){
  const [rows] = await pool.query("SELECT * FROM bookings WHERE id = :id", { id });
  return rows[0] || null;
}

async function findAllByUser(userId){
  const [rows] = await pool.query("SELECT * FROM bookings WHERE UserId = :userId ORDER BY id DESC", { userId });
  return rows;
}

module.exports = { create, findByPk, findAllByUser };
