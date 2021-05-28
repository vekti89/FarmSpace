const express = require("express"); 
const router = express.Router();
const basket = require("../controllers/basket");

const {isLoggedIn} = require("../middleware");

//add product to basket
router.get("/add-to-basket/:id", basket.addToBasket)

//reduce qty of the product in basket
router.get("/reduce-qty/:id", basket.reduceQty)
//add qty of the product in basket
router.get("/add-qty/:id", basket.addQty)

//remove product from the basket
router.get("/delete-item/:id", basket.delete)

//empty the basket
router.get("/empty-basket", basket.emptyBasket)

//render basket page
router.get("/basket", basket.renderBasket)

//checkout
router.get("/checkout", isLoggedIn, basket.checkout)

module.exports = router; 