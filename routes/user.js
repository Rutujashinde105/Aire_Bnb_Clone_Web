const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync= require("../utils/WrapAsync.js");
const { Passport } = require("passport");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js")


router
.route("/signup")
.get(userController.renderSignupForm)
.post( WrapAsync(userController.signup));


router.route("/login")
.get( userController.renderLoginForm
)
.post(
  saveRedirectUrl, 
  passport.authenticate('local', { 
    failureRedirect: "/login",
    failureFlash: true,
    
  }),
  userController.login
);

router.get("/logout",
  (req,res,next)=>{
  req.logOut((err) =>{
    if(err){
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
 } 
);


module.exports = router;