const Listing = require("../models/listing");
console.log("DEBUG Listing import:", Listing);
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index =  async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}  

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs"); 
} 

module.exports.showListing = async (req, res) => {
  console.log("its works 1")
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path :"reviews",
   populate: { path: "author",}
   } 
   ).populate("owner");
   if(!listing){
     req.flash("error","listing you requested for does not exist!")
     return res.redirect("/listings");
   }
   console.log(listing);
  res.render("./listings/show.ejs", { listing , mapToken: process.env.MAP_TOKEN });
}


module.exports.createListing = async (req, res, next) => {

  let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
}).send();
// console.log(response.body.features[0].geometry);
console.log("MAPBOX RESPONSE:", response.body.features);

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing); 
  console.log(req.user);
  newListing.owner = req.user._id;
  newListing.image = {url , filename};

  if (response.body.features.length > 0) {
    newListing.geometry = response.body.features[0].geometry;
  } else {
    // fallback only if Mapbox gives no result
    newListing.geometry = { 
      type: "Point", 
      coordinates: [0, 0] 
    }
  }

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success","New Listing Created");
  res.redirect(`/listings/${savedListing._id}`);

}


module.exports.renderEditForm =   async(req,res)=>{ 
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
  req.flash("error","listing you requested for does not exist!")
  res.redirect("/listings")

} let originalImageUrl = listing.image.url;
  originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250" );
  console.log("error" + {listing });
    res.render("./listings/edit.ejs", {listing , originalImageUrl});
   
}    

module.exports.updateListing = async (req, res) => {  
    console.log("put == " + req.params.id);

    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    Object.assign(listing, req.body.listing);

    console.log("Uploaded file:", req.file);

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    return res.redirect(`/listings/${id}`);
};

module.exports.destroyListing =  async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}