const pool = require("../db");
const Listing = require("./listing");

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
  if (!rows[0]) return null;
  
  const booking = rows[0];
  
  // Get listing with all related data (owner, reviews, amenities)
  if (booking.ListingId) {
    booking.listing = await Listing.findByPk(booking.ListingId);
  }
  
  return booking;
}

async function findAllByUser(userId){
  const [rows] = await pool.query(
    `SELECT b.*, l.id as listing_id, l.title, l.image, l.price, l.location, l.country 
     FROM bookings b 
     INNER JOIN listings l ON b.ListingId = l.id 
     WHERE b.UserId = :userId 
     ORDER BY b.id DESC`,
    { userId }
  );
  return rows.map(r => ({
    id: r.id,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    totalPrice: r.totalPrice,
    createdAt: r.createdAt,
    listing: {
      id: r.listing_id,
      title: r.title,
      image: r.image,
      price: r.price,
      location: r.location,
      country: r.country
    }
  }));
}

module.exports = { create, findByPk, findAllByUser };
