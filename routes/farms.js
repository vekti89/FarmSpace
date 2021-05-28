const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {validateFarm, isLoggedIn, isOwner} = require("../middleware"); 

const farms = require("../controllers/farms");

const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

//index page
router.get("/", farms.index) 

//create new farm
router.get("/new", isLoggedIn, farms.renderNewForm);
router.post("/", isLoggedIn, upload.array("photo"), validateFarm, catchAsync(farms.createFarm)) 

//edit farm
router.get("/:id/edit", isLoggedIn, isOwner, catchAsync(farms.renderEditForm))
router.put("/:id", isLoggedIn, isOwner, upload.array("photo"), validateFarm, catchAsync(farms.editFarm))

//delete farm 
router.delete("/:id", isLoggedIn, isOwner, catchAsync(farms.deleteFarm))

//owner page
router.get ("/:id/owner/:ownerId", catchAsync(farms.ownerPage))

//show page
router.get ("/:id", catchAsync(farms.showPage))



module.exports=router; 