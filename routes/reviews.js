const express = require("express"); 
const router = express.Router({mergeParams:true}); 
const catchAsync = require("../utils/catchAsync"); 
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviews = require("../controllers/reviews"); 

//  CREATE REVIEW =======
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview))

//  DELETE REVIEW =======

router.delete("/:revId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router; 