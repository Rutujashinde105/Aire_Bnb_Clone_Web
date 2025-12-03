const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      // req.session.redirect= req.originalUrl;
  req.flash("error", "you must be logged in to create listing ")
  return res.redirect("/login");
}
next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next ();
};

module.exports.isOwner = async(req, res , next) =>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "you are not owner of this listing")
    return res.redirect(`/listings/${id}`)
  }
  next()
}


module.exports.isReviewAuthor = async(req, res , next) =>{
  let {id , reviewId} = req.params;
  console.log("hello")
  let review = await Review.findById(reviewId);
  console.log("review workss")
  if (!review.author.equals(res.locals.currUser._id)) {
    console.log("ite find have but you west")
    req.flash("error", "you are not author of this listing review")
    return res.redirect(`/listings/${id}`)
  } 
  next()
}