const express = require("express");
const app = express();
const router = express.Router( {mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {  reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


const validateReview = (req,res,next) =>{
    let error = reviewSchema.validate(req.body);
    console.log(result); 
    if( error )  {
        let errMsg= error.details.map((el)=> el.message).join(".") ;
        throw new ExpressError(400,  errMsg);
    }  else{
        next();  
    }
};

app.use(express.urlencoded({ extended: true }));
const reviewController = require("../controllers/reviews.js")

// POST REVIEW ROUTE NEW 

router.post("/", 
     isLoggedIn,
     WrapAsync(reviewController.createReview)
    );


//Delete Review Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    WrapAsync(reviewController.destroyReview)
);

module.exports= router;
