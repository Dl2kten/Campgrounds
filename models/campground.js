const mongoose = require("mongoose");
const Schema = mongoose.Schema; //use a variable to shorten calls to Schema

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String, 
    location: String,
    reviews: [
        {type: Schema.Types.ObjectId, ref: "Review"}
    ]
});

module.exports = mongoose.model("Campground", CampgroundSchema);