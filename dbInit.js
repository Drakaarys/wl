const pool = require("./db");

async function ensureSchema() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      passwordHash VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB`);

    await conn.query(`CREATE TABLE IF NOT EXISTS listings (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(1024) NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      location VARCHAR(255),
      country VARCHAR(255),
      category ENUM('Trending','Hotels','Mountains','Beach','Iconic cities','Best views','Stargazing','Snow','Lakes','Clouds','World','Farm'),
      ownerId INT UNSIGNED,
      INDEX idx_owner (ownerId),
      CONSTRAINT fk_listings_owner FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB`);

    await conn.query(`CREATE TABLE IF NOT EXISTS amenities (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      icon VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT
    ) ENGINE=InnoDB`);

    await conn.query(`CREATE TABLE IF NOT EXISTS reviews (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      comment TEXT,
      rating INT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      authorId INT UNSIGNED,
      ListingId INT UNSIGNED,
      INDEX idx_rev_author (authorId),
      INDEX idx_rev_listing (ListingId),
      CONSTRAINT fk_reviews_author FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_reviews_listing FOREIGN KEY (ListingId) REFERENCES listings(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);

    await conn.query(`CREATE TABLE IF NOT EXISTS bookings (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      checkIn DATETIME NOT NULL,
      checkOut DATETIME NOT NULL,
      totalPrice DECIMAL(10,2) NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UserId INT UNSIGNED,
      ListingId INT UNSIGNED,
      INDEX idx_b_user (UserId),
      INDEX idx_b_listing (ListingId),
      CONSTRAINT fk_bookings_user FOREIGN KEY (UserId) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_bookings_listing FOREIGN KEY (ListingId) REFERENCES listings(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);

    await conn.query(`CREATE TABLE IF NOT EXISTS listing_amenities (
      ListingId INT UNSIGNED NOT NULL,
      AmenityId INT UNSIGNED NOT NULL,
      PRIMARY KEY (ListingId, AmenityId),
      CONSTRAINT fk_la_listing FOREIGN KEY (ListingId) REFERENCES listings(id) ON DELETE CASCADE,
      CONSTRAINT fk_la_amenity FOREIGN KEY (AmenityId) REFERENCES amenities(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);
  } finally {
    conn.release();
  }
}

module.exports = ensureSchema;


