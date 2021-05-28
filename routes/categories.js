const express = require("express"); 
const router = express.Router(); 
const categories = require("../controllers/categories");

//all products
router.get("/products", categories.allProducts)

//Fruit & Nuts
router.get("/fruit&nuts", categories.fruitAndNuts)

//Vegetables
router.get("/vegetables", categories.vegetables)

//Eggs & Dairy
router.get("/eggs&dairy", categories.eggsAndDairy)

//Salads, Herbs, Oil
router.get("/salads&herbs&oil", categories.saladsHerbsAndOil)

//searched products
router.post("/products", categories.searchedProducts)

module.exports=router; 