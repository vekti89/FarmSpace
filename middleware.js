const {farmSchema, productSchema, userSchema, reviewSchema} = require("./schemas");
const Farm = require("./models/farm");
const Review = require("./models/review"); 
const ExpressError = require("./utils/ExpressError"); 

//  FARM VALIDATION MIDDLEWARES ====
module.exports.validateFarm = (req, res, next)=>{
    const {error} = farmSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        console.log(error);
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

//  PRODUCT VALIDATION MIDDLEWARES ====
module.exports.validateProduct = (req, res, next)=>{
    const {error} = productSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// USER IS FARMOWNER?
module.exports.isOwner = async(req, res, next)=> { 
    const {id} = req.params; 
    const farm = await Farm.findById(id);
    if(!farm.owner.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that.");
        return res.redirect(`/farms/${id}`);
    }
    next();
}

// USER LOGGED IN
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
    req.flash("error", "You must be signed in first."); 
    return res.redirect("/login");
    }
    next();
}

//  REVIEW VALIDATION MIDDLEWARE====
module.exports.validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body); 
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, revId} = req.params;   
    const review = await Review.findById(revId); 
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that.")
        return res.redirect(`/farms/${id}`); 
    } 
    next(); 
}