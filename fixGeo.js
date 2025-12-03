require('dotenv').config();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapBoxToken = process.env.MAP_TOKEN; 
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

//  1: Connect to MongoDB 
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

async function fixAllGeometry() {
  try {
    // 🔵 2: Get all listings
    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings.`);

    for (let listing of listings) {
      if (!listing.location || listing.location.trim() === "") {
        console.log(`Skipping: ${listing._id} (no location)`);
        continue;
      }

      console.log(`Geocoding: ${listing.location}`);

      //  3: Mapbox Geocoding Request
      let geoRes = await geocodingClient
        .forwardGeocode({
          query: listing.location,
          limit: 1
        })
        .send();

      if (
        geoRes.body.features &&
        geoRes.body.features.length > 0
      ) {
        listing.geometry = geoRes.body.features[0].geometry;

        await listing.save();
        console.log(` Updated ${listing.title} → ${listing.geometry.coordinates}`);
      } else {
        console.log(` No coordinates found for: ${listing.location}`);
      }
    }

    console.log("✨ Completed updating all listings!");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit();
  }
}

fixAllGeometry();
