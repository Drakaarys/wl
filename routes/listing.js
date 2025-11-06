const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const Amenity = require("../models/amenity");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    } 
}
// ...imports and middleware...

// INDEX
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.findAll();
    res.render("listings/index.ejs", { allListings });
}));

// NEW
router.get("/new", isLoggedIn, wrapAsync(async (req, res) => {
  const amenities = await Amenity.findAll();
  res.render("listings/new.ejs", { amenities });
}));

// CREATE
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const payload = req.body.listing;
    await Listing.create({ ...payload, ownerId: req.user.id });
    req.flash("success", "New listing created successfully");
    res.redirect("/listings");
}));

// ✅ PUT THIS BEFORE `/:id`
router.get("/search", wrapAsync(async (req, res) => {
    const { city } = req.query;
    if (!city) return res.redirect("/listings");

    const listings = await Listing.searchByCity(city);

    res.render("listings/search.ejs", { listings, city });
}));

// ✅ ALSO PUT THIS BEFORE `/:id`
router.get("/category/:categoryName", wrapAsync(async (req, res) => {
    const { categoryName } = req.params;
    const listings = await Listing.findByCategory(categoryName);
    res.render("listings/category.ejs", { listings, categoryName });
}));

// SHOW
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByPk(id);
    if (!listing) {
        req.flash("error", "The listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const listing = await Listing.findByPk(req.params.id);
  const amenities = await Amenity.findAll();
  res.render("listings/edit.ejs", { listing, amenities });
}));

// UPDATE
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.update(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// DELETE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.destroy(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;
