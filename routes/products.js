const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, validateProduct, isOwner} = require("../middleware");

const products = require("../controllers/products");

const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

//index
router.get("/", catchAsync(products.index))

//new product
router.get("/new", isLoggedIn, isOwner, catchAsync(products.renderNewForm))
router.post("/", isLoggedIn, isOwner, upload.array("photo"), validateProduct, catchAsync(products.createProduct))

//edit product
router.get("/:productId/edit", isLoggedIn, isOwner, catchAsync(products.renderEditForm))
router.put ("/:productId", isLoggedIn, isOwner, upload.array("photo"), validateProduct, catchAsync(products.editProduct))

// delete product 
router.delete("/:productId", isLoggedIn, isOwner, catchAsync(products.deleteProduct))

//show page
router.get("/:productId", catchAsync(products.showPage))


module.exports = router;
