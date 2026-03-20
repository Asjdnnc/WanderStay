require('dotenv').config({ path: '../.env' });
const mongoose = require("mongoose");  //requreing the mongoose library
const initData = require("./data.js");  //requering the data 
const Listing = require("../models/listing.js");    
const mongodb = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/project";    //connecting with the moongoose data base
main()
.then(() => {
    console.log("connection successfull to", mongodb);
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(mongodb);
}
const initDB = async () => { //inserting large data in database
    await Listing.deleteMany({});   //reseting the database
    await Listing.insertMany(initData.data);  // adding data
    console.log("Data was initialized")
};
initDB(); //calling the function