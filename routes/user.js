const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

//new route
router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Welcome to Yelp Camp");
            res.redirect("/campgrounds");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/register");
    }
}))

//login route
router.get("/login", (req, res) => {
    res.render("users/login");
})

router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome Back");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
})

//logout route
router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        else {
            req.flash("success", "Goodbye!");
            res.redirect("/campgrounds");
        }
    });
})
module.exports = router;