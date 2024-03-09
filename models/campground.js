const mongoose = require("mongoose");
const Review = require("./review");
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

CampgroundSchema.post("findOneAndDelete", async function(campground){
    if(campground) {
        await Review.deleteMany({_id: {$in: campground.reviews}});
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);