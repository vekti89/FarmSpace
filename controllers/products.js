const Farm = require("../models/farm"); 
const Product = require("../models/product");
const Basket = require("../models/basket");

const cloudinary = require('cloudinary').v2;

module.exports.index = async(req, res)=>{
    const {id}= req.params; 
    const farm = await Farm.findById(id).populate("products"); 
    res.render("products/index", {id, farm})
}

module.exports.renderNewForm = async(req, res)=>{
    const{id}= req.params; 
    const farm = await Farm.findById(id); 
    res.render("products/new", {farm})
}

module.exports.createProduct = async(req, res)=>{
    const{id}=req.params; 
    const product = new Product(req.body.product);
    product.photos = req.files.map(f => ({url:f.path, filename: f.filename}));
    const farm = await Farm.findById(id); 
    await product.save();
    farm.products.push(product); 
    await farm.save(); 
    req.flash("success", "Product added!");
    res.redirect(`/farms/${farm._id}/products/${product._id}`);  
}

module.exports.renderEditForm = async(req,res)=>{
    const{id,productId}=req.params; 
    const farm = await Farm.findById(id);
    const product = await Product.findById(productId);
    if(!product){
        req.flash("error", "Cannot find that product...");
        return res.redirect(`/farms/${farm._id}/products`)
    }
    res.render("products/edit", {farm, product})
}

module.exports.editProduct = async(req,res)=>{
    const{id,productId}=req.params; 
    const farm = await Farm.findById(id);
    const product = await Product.findByIdAndUpdate(productId, {...req.body.product});
    //map would not give an object, it would give an array which I cannot push and pass the validation, so I have to take only the data and spread it and then push into existing aray of objects
    const photos = req.files.map(f => ({url:f.path, filename: f.filename}));
    product.photos.push(...photos); 
    await product.save();
    if (req.body.deletePhotos){
        for(let filename of req.body.deletePhotos){
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({$pull:{
            photos: {filename: {$in:req.body.deletePhotos}}}})}
    req.flash("success", `${product.name} has been updated.`);
    res.redirect(`/farms/${farm._id}/products/${product._id}`); 
}

module.exports.deleteProduct = async(req, res)=>{
    const {id, productId} = req.params; 
    const farm = await Farm.findById(id);
    const product = await Product.findByIdAndDelete(productId); 
    for(let photo of product.photos){
        await cloudinary.uploader.destroy(photo.filename); 
    } 
    req.flash("success", `${product.name} has been deleted.`);
    res.redirect(`/farms/${farm._id}/products/`);
}

module.exports.showPage = async(req, res)=>{
    const basket = new Basket(req.session.basket ? req.session.basket : {items : {}});
    const{id,productId}=req.params; 
    const farm = await Farm.findById(id);
    const product = await Product.findById(productId);
    if(!product){
        req.flash("error", "Cannot find that product...");
        return res.redirect(`/farms/${farm._id}/products`)
    }
    res.render("products/show", {farm, product, productId, basket});
}