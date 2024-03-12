const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const {campgroundSchema, reviewSchema} = require("./JoiSchemas");
const Campground = require("./models/campground");
const Review = require("./models/review");
const campgroundRoutes = require("./routes/campgrounds");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch((err) => {
        console.log("Mongo connection error", err);
    });


const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.use("/campgrounds", campgroundRoutes);

app.get("/", (req, res) => {
    res.render("home");
})

//delete route
app.delete("/campgrounds/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params; 
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

//post route for reviews
app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async(req, res, next)=> {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

//delete route for reviews
app.delete("/campgrounds/:campgroundId/reviews/:reviewId", catchAsync(async(req, res, next) => {
    const {campgroundId, reviewId} = req.params;
    await Campground.findByIdAndUpdate(campgroundId, {$pull: {reviews: reviewId}});   
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${campgroundId}`); 
}))

//error handling
app.all("*", (req, res, next)=>{
    next(new ExpressError("Page not found", 404));
})
app.use((err, req, res, next) => {
    const {statusCode=500} = err;
    if(!err.message) {
        err.message = "Something went wrong";
    }
    res.status(statusCode).render("error", {err});
})


app.listen(3000, () => {
    console.log("Listening on port 3000");
})