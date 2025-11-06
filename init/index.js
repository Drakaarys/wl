const ensureSchema = require("../dbInit");
const initData = require("./data.js");
const pool = require("../db");
const Listing = require("../models/listing.js");

const initDB = async () => {
  await ensureSchema();
  await pool.query("DELETE FROM reviews");
  await pool.query("DELETE FROM bookings");
  await pool.query("DELETE FROM listing_amenities");
  await pool.query("DELETE FROM listings");

  const mapped = initData.data.map((obj) => ({
    ...obj,
    image: obj.image?.url || obj.image,
    ownerId: 1
  }));
  for (const item of mapped) {
    await Listing.create(item);
  }
  console.log("data was initialized");
};

initDB();