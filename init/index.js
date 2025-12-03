const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
// const initData = require("./new_data.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() =>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    // await Listing.deleteMany({});
    initData.data =initData.data.map((obj) => ({...obj, owner: "6875455c3e4ffdbeb61b764e"}))
    await Listing.insertMany(initData.data);
    console.log("data initialized");
    console.log(typeof Listing.deleteMany); 
};
console.log("its work all")
initDB();




