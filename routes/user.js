const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");


//new route
router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.createUser));

//login route
router.route("/login")
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), 
    users.loginUser);

//logout route
router.get("/logout", users.logoutUser);
module.exports = router;