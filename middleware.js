const Listing=require("./models/listing");
const Review=require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
            req.flash("error","You must be logged in to perform the action");
            return res.redirect("/login");
    }
    next();    
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();    
};

module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    const listing=await Listing.findByPk(id);
    if(!listing || listing.ownerId !== res.locals.currUser.id){
        req.flash("error","You dont have permission to do this");
        return res.redirect(`/listings/${id}`);
    }
    next();    
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findByPk(reviewId);
    if(!review || review.authorId !== res.locals.currUser.id){
        req.flash("error","You dont have permission to do this");
        return res.redirect(`/listings/${id}`);
    }
    next();     
};

