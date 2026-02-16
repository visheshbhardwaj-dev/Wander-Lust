const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const { required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
   url:String,
   filename:String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"

  },
  category:{
    type: String,
    enum:[
      "Rooms",
      "Iconic_cities",
      "Beaches",
      "Mountains",
      "Amazing_pools",
      "Camping",
      "Cabin",
      "Igloo",
      "Farms",
      "Apartments"
      
    ],
    required:true

  }

});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;