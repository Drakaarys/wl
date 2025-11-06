// const mongoose=require("mongoose");
// const Schema=mongoose.Schema;
// const Review=require("./review.js"); 
// const User=require("./user.js");

// const listingSchema=new Schema({
//     title:{
//         type:String,
//         required:true,
//     },
//     description:String,
//     image:{
//         type:String,
//         default: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//         set:(v)=>v===""?"https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60":v,
//     },
//     price:Number,
//     location:String,
//     country:String,
//     reviews:[
//         {
//             type:Schema.Types.ObjectId,
//             ref:"Review"
//         }
//     ],
//     owner:{
//         type:Schema.Types.ObjectId,
//         ref:"User"
//     },
//     category:{
//         type:String,
//         enum:["Trending","Hotels","Mountains","Beach","Iconic cities","Best views","Stargazing","Snow","Lakes","Clouds","World","Farm"],
//     }
// });

// listingSchema.post("findOneAndDelete",async(listing)=>{
//     if(listing){
//         await Review.deleteMany({_id:{$in:listing.reviews}});
//     }
// })

// const Listing=mongoose.model("Listing",listingSchema);
// module.exports=Listing;

const pool = require("../db");

async function findAll(){
  const [rows] = await pool.query("SELECT * FROM listings ORDER BY id DESC");
  return rows;
}

async function findByPk(id){
  const [rows] = await pool.query("SELECT * FROM listings WHERE id = :id", { id });
  if (!rows[0]) return null;
  
  const listing = rows[0];
  
  // Get owner
  if (listing.ownerId) {
    const [ownerRows] = await pool.query("SELECT id, username, email FROM users WHERE id = :id", { id: listing.ownerId });
    listing.owner = ownerRows[0] || null;
  }
  
  // Get reviews with authors
  const [reviewRows] = await pool.query(
    `SELECT r.*, u.id as author_id, u.username as author_username 
     FROM reviews r 
     LEFT JOIN users u ON r.authorId = u.id 
     WHERE r.ListingId = :id 
     ORDER BY r.createdAt DESC`,
    { id }
  );
  listing.reviews = reviewRows.map(r => ({
    id: r.id,
    comment: r.comment,
    rating: r.rating,
    createdAt: r.createdAt,
    author: r.author_id ? { id: r.author_id, username: r.author_username } : null
  }));
  
  // Get amenities
  const [amenityRows] = await pool.query(
    `SELECT a.* FROM amenities a 
     INNER JOIN listing_amenities la ON a.id = la.AmenityId 
     WHERE la.ListingId = :id`,
    { id }
  );
  listing.amenities = amenityRows || [];
  
  return listing;
}

async function create(data){
  const { title, description, image, price, location, country, category, ownerId } = data;
  const [res] = await pool.query(
    `INSERT INTO listings (title, description, image, price, location, country, category, ownerId)
     VALUES (:title, :description, :image, :price, :location, :country, :category, :ownerId)`,
    { title, description, image, price, location, country, category, ownerId }
  );
  return await findByPk(res.insertId);
}

async function update(id, data){
  const fields = ["title","description","image","price","location","country","category"];
  const sets = [];
  const params = { id };
  for (const f of fields){
    if (data[f] !== undefined) { sets.push(`${f} = :${f}`); params[f] = data[f]; }
  }
  if (sets.length === 0) return await findByPk(id);
  await pool.query(`UPDATE listings SET ${sets.join(", ")} WHERE id = :id`, params);
  return await findByPk(id);
}

async function destroy(id){
  await pool.query("DELETE FROM listings WHERE id = :id", { id });
}

async function findByCategory(category){
  const [rows] = await pool.query("SELECT * FROM listings WHERE category = :category", { category });
  return rows;
}

async function searchByCity(city){
  const [rows] = await pool.query("SELECT * FROM listings WHERE location LIKE :q", { q: `%${city}%` });
  return rows;
}

module.exports = { findAll, findByPk, create, update, destroy, findByCategory, searchByCity };
