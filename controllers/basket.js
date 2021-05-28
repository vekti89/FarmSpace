const Basket = require("../models/basket"); 
const Product = require("../models/product"); 
const Order = require("../models/order");

module.exports.addToBasket = async(req, res, next)=>{
    const productId = req.params.id; 
    const basket = new Basket(req.session.basket ? req.session.basket : {items : {}});
    const product = await Product.findById(productId);
    //const redirectUrl = req.header("Referer");
    //console.log("RedURL is ", req.header("Referer")) 
    if(!product){
        req.flash("error", "This product is not awailable any more."); 
        return res.redirect("/farms"); 
    }
    basket.add(product, productId); 
    req.session.basket = basket; 
    res.redirect("/basket");
}

module.exports.reduceQty = async(req, res)=> {
    const productId = req.params.id;
    const basket = new Basket(req.session.basket ? req.session.basket : {});
    basket.reduceQty(productId);
    req.session.basket = basket; 
    res.redirect("/basket");
}

module.exports.addQty = async(req, res)=> {
    const productId = req.params.id;
    const basket = new Basket(req.session.basket ? req.session.basket : {}); 
    basket.addQty(productId);
    req.session.basket = basket; 
    res.redirect("/basket");
}

module.exports.delete = async(req, res)=> {
    const productId = req.params.id;
    const basket = new Basket(req.session.basket ? req.session.basket : {}); 
    basket.deleteItem(productId);
    req.session.basket = basket; 
    res.redirect("/basket");
}

module.exports.emptyBasket = async(req, res)=> {
    const basket = new Basket(req.session.basket ? req.session.basket : {}); 
    basket.emptyBasket();
    req.session.basket = basket; 
    res.redirect("/basket");
}

module.exports.renderBasket = (req, res, next)=>{
    if(!req.session.basket){
        return res.render("basket", {products:null});
    } else{
    var basket = new Basket(req.session.basket);
    res.render("basket", {products: basket.generateArray(), totalPrice:basket.totalPrice});
}}

module.exports.checkout = async(req, res, next)=>{
    if(!req.session.basket){
        return res.redirect("/basket")
    }
    const basket = new Basket(req.session.basket);
    const order = new Order({
        user: req.user,
        basket: basket,
    });
    await order.save();
    req.flash("success", `Dear ${req.user.anrede}, thank you for your order!`)
    delete req.session.basket; 
    res.redirect(`/account/${req.user._id}`);
}