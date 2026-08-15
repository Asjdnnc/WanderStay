const mongoose = require("mongoose"); //requiring the moongoose library
const Schema = mongoose.Schema;   //creating schema similar to table in mySQL 
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({  //defining schema  
    title : {
       type : String,
       required : true,
    },
    clickCount: {
      type:Number,
      default:1},
    description : String,
    image : {
        url:String,
        filename:String,
    },
    price : Number,
    location : String,
    country : String,

    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
   geometry:{ //geoJSON format
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
   },
   categories: [String],
   isApproved: {
      type: Boolean,
      default: false
   }
});


  //query middleware
  listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await Review.deleteMany({_id:{$in:listing.reviews}})
    }
  });

const Listing = mongoose.model("Listing", listingSchema); //model creation 
module.exports = Listing; //model export to index.js in init folder
