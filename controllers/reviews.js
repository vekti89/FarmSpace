const Review = require("../models/review"); 
const Farm = require("../models/farm"); 

module.exports.createReview = async(req, res)=>{
    const farm = await Farm.findById(req.params.id); 
    const review = new Review(req.body.review);
    review.author = req.user._id; 
    farm.reviews.push(review); 
    await review.save(); 
    await farm.save(); 
    req.flash("success", "Your review has been added!"); 
    res.redirect(`/farms/${farm._id}`)
}

module.exports.deleteReview = async(req, res)=>{
    const {id, revId} = req.params; 
    await Farm.findByIdAndUpdate(id, { $pull: {reviews: revId} });
    await Review.findByIdAndDelete(revId); 
    req.flash("success", "Review deleted!")
    res.redirect(`/farms/${id}`); 
}