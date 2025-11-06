// seed.js
const mysql = require("mysql2/promise");
const { data: sampleListings } = require("./init/data"); // adjust if your file has a different name

async function seedDatabase() {
  let connection;

  try {
    // 1️⃣ Connect to MySQL
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "whaibro@7", // replace with your actual MySQL password
      database: "travel", // use the same DB you created
    });

    console.log("✅ Connected to MySQL!");

    // 2️⃣ Optional: clear the table before inserting
    await connection.query("DELETE FROM listings");
    console.log("🗑️ Cleared existing listings");

    // 3️⃣ Prepare the insert query
    const insertQuery = `
      INSERT INTO listings 
      (title, description, image, price, location, country, category) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // 4️⃣ Loop through your sample data and insert each record
    for (let listing of sampleListings) {
      const { title, description, price, location, country, category } = listing;
      const image = listing.image.url; // extract URL from nested object

      await connection.query(insertQuery, [
        title,
        description,
        image,
        price,
        location,
        country,
        category,
      ]);
    }

    console.log(`🌱 Inserted ${sampleListings.length} listings successfully!`);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 MySQL connection closed");
    }
  }
}

seedDatabase();
