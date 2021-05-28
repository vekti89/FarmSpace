
const Product = require("../models/product"); 

module.exports.allProducts = async(req, res)=>{
    const products = await Product.find();
    res.render("products", {products:products, category:""})
}

module.exports.fruitAndNuts = async(req, res)=>{
    const products = await Product.find({category: "Fruit & Nuts"}); 
    res.render("products", {products:products, category:"Fruit & Nuts"})
}

module.exports.vegetables = async(req, res)=>{
    const products = await Product.find({category: "Vegetables"}); 
    console.log(products);
    res.render("products", {products:products, category: "Vegetables"})
}

module.exports.eggsAndDairy = async(req, res)=>{
    const products = await Product.find({category: "Eggs & Dairy"}); 
    console.log(products);
    res.render("products", {products:products, category: "Eggs & Dairy"})
}

module.exports.saladsHerbsAndOil = async(req, res)=>{
    const products = await Product.find({category: "Salads, Herbs, Oil"}); 
    console.log(products);
    res.render("products", {products:products, category: "Salads, Herbs, Oil"})
}

module.exports.searchedProducts =  async(req, res)=>{
    const product = req.body.search; 
    const products = await Product.find({name: new RegExp(product, 'i')});
    if(products.length===0){
        req.flash("error", "Your search did not return any results. Check out our farms for their complete offer.");
        return res.redirect("/farms");
    } 
    return res.render("products", {products:products, category:"Search Results"})
}