const mysql = require("mysql2/promise");
const { data: sampleListings } = require("./init/data");
 // adjust if your file has a different name

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_mysql_password", // 🔹 replace with your actual MySQL password
    database: "travel", // 🔹 use the same DB you created
  });

  console.log("✅ Connected to MySQL!");

  // Optional: clear the table before inserting
  await connection.query("DELETE FROM listings");

  const insertQuery = `
    INSERT INTO listings 
    (title, description, image_url, price, location, country, category) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  for (let listing of sampleListings) {
    const { title, description, image, price, location, country, category } = listing;
    await connection.query(insertQuery, [
      title,
      description,
      image.url,
      price,
      location,
      country,
      category,
    ]);
  }

  console.log(`🌱 Inserted ${sampleListings.length} listings successfully!`);
  await connection.end();
}

seedDatabase().catch(err => console.error("❌ Error seeding database:", err));
