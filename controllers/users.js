const User = require("../models/user");
const Order = require("../models/order");
const Basket = require("../models/basket");
const Farm = require("../models/farm");

module.exports.renderRegisterForm = (req, res)=>{
    res.render("users/register"); 
}

module.exports.registerUser = async (req,res)=>{
    /*in case we have a user with the same username, 
    prevent hitting base error handler, flash the message and redirect to register*/
    try{const {firstName, lastName, gender, username, password, email, streetAddress, city, country, zipCode} = req.body;  
        const user = new User({firstName, lastName, gender, email, username, streetAddress, city, country, zipCode});
        user.photo = {url:req.file.path.replace("/upload", "/upload/ar_1:1,c_fill,w_550,g_face/"), filename:req.file.filename};
        const registeredUser = await User.register(user, password);
        //req.login requires a callback
        req.login(registeredUser, err =>{
            if(err) return next(err);
            req.flash("success", `Welcome to FarmSpace, ${user.anrede}!`);
            res.redirect("/farms");
        })
    } catch (e){
        req.flash("error", `${e.message}!`); 
        res.redirect("register"); 
    }
} 

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login")
}

module.exports.loginUser = (req,res)=>{
    req.flash("success", `Welcome back, ${req.user.anrede}!`);
    const redirectUrl = req.session.returnTo || "/farms"; 
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res)=>{
    delete req.session.basket;
    req.logout(); 
    req.flash("success", "Logged you out.") 
    res.redirect("/farms"); 
}

module.exports.accountPage = async(req, res)=>{
    const {user} = req;
    if(!user){
        req.flash("error", "You need to login first."); 
        res.redirect("/farms");
    }
    const orders = await Order.find({user:req.user}); 
    const farms = await Farm.find({owner:req.user._id});
    orders.forEach(function(order) {
        const basket = new Basket(order.basket); 
        order.items = basket.generateArray();
    })
    res.render("users/account", {orders:orders, user, farms})
}
 