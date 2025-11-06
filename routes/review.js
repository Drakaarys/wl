const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    } 
}

//Reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    await Review.create({
        ...req.body.review,
        ListingId: listing.id,
        authorId: req.user.id
    });
    req.flash("success","New review created successfully");
    res.redirect(`/listings/${listing.id}`);
}));

//delete review
router.delete("/:reviewId",isReviewAuthor,wrapAsync(async(req,res)=>{
    const { id, reviewId } = req.params;
    await Review.destroy(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;
