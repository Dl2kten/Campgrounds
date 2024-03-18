const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {validateReview} = require("../middleware");



//post route for reviews
router.post("/", validateReview, catchAsync(async(req, res, next)=> {
    const campground = await Campground.findById(req.params.campgroundId);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created new review");
    res.redirect(`/campgrounds/${campground._id}`);
}))

//delete route for reviews
router.delete("/:reviewId", catchAsync(async(req, res, next) => {
    const {campgroundId, reviewId} = req.params;
    await Campground.findByIdAndUpdate(campgroundId, {$pull: {reviews: reviewId}});   
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${campgroundId}`); 
}))

module.exports = router;