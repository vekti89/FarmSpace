const express = require('express');
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

const users = require("../controllers/users");

const multer = require("multer"); 
const {storage} = require("../cloudinary"); 
const upload = multer({storage});

//user register
router.get("/register", users.renderRegisterForm)
router.post("/register", upload.single("photo"), catchAsync(users.registerUser))

//user login
router.get("/login", users.renderLoginForm)
router.post ("/login", passport.authenticate(
    "local", {
        failureFlash:true, 
        failureRedirect:"/login"
    }), users.loginUser);

//user logout
router.get("/logout", users.logoutUser)

//user account
router.get("/account/:id", catchAsync(users.accountPage))

module.exports = router; 

