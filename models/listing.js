const Module = require("module");
const mongoose= require("mongoose");
const { type } = require("os");
const data = require("../init/data.js");
const review = require("./review.js");
const { ref } = require("process");
const { url } = require("inspector");
const { string, number, required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
 title:{
    type:String,
    required: true
 },
description: String,

image: {
  data: {
    type: String,
    default: 'defaultImage'
  },
  url: {
    type: String,
    default: 'https://static.vecteezy.com/system/resources/previews/030/258/039/non_2x/beautiful-nature-wallpaper-hd-wallpaper-ai-generated-free-photo.jpg',
    set: (v) =>
      v === ''
        ? 'https://static.vecteezy.com/system/resources/previews/030/258/039/non_2x/beautiful-nature-wallpaper-hd-wallpaper-ai-generated-free-photo.jpg'
        : v,
  }
},

// image: {
//   url: String,
//   filename: String,
// },
price:  Number,
location: String,
country: String,

reviews: [
  {
    type: Schema.Types.ObjectId,
    ref: "Review"
  }
],
owner: {
  type: Schema.Types.ObjectId,
  ref: "User",
},
geometry: {
  type:{
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
  }
}

});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await review.deleteMany({ _id: {$in : listing.reviews}})
  }
})

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;


