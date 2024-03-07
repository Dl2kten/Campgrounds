const mongoose = require("mongoose");
const {Schema} = mongoose;

const ReviewSchema = new Schema({
    body: String,
    stars: Number
})

modules.export = mongoose.model("Review", ReviewSchema);