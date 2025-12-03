const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require('../models/listing.js');
const {isLoggedIn ,isOwner } = require("../middleware.js");
const User = require("../models/user"); 
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({storage})

const listingController = require("../controllers/listings.js")

const validateListing = (req,res,next) =>{
  debugger;
    let error = listingSchema.validate(req.body);
   // console.log(result); 

    console.log("validate listing "+JSON.stringify(req.body));
    if( error )  {
       // let errMsg= error.details.map((el)=> el.message).join(".") ;
       let errMsg=error;
        throw new ExpressError(400,  errMsg);
    }  else{
        next();  
    }
};
// its new generated code to make more easy to read called as s router.route
  // index route

router
  .route("/")
  .get(WrapAsync(listingController.index)) 
  .post(
    isLoggedIn,
    upload.single("image"),
    WrapAsync(listingController.createListing)
  );



//NEW ROUTE

router.get("/new",
  isLoggedIn,
  isLoggedIn , listingController.renderNewForm
 );
 
router.route("/:id")
  .get(WrapAsync(listingController.showListing))
  .put(
     isLoggedIn,
     isOwner,
     upload.single("image"),
     WrapAsync(listingController.updateListing)
  )
  .delete(
     isLoggedIn,
     isOwner,
     WrapAsync(listingController.destroyListing)
  );

// CREATE ROUTE
router.post("/",
  isLoggedIn ,
     WrapAsync(listingController.createListing)
  );


//EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
WrapAsync(listingController.renderEditForm) 
  );
 

module.exports = router;