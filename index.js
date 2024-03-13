const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");


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
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig ={
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        //expires in a week, 1000ms * 60s * 60min * 24hrs * 7d
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
}
app.use(session(sessionConfig));
app.use(flash());

//flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//Router
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:campgroundId/reviews", reviewRoutes);

app.get("/", (req, res) => {
    res.render("home");
})


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