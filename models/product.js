const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
    url: String,
    filename: String, 
}); 
//to include virtuals when converting a document to JSON (res.json())
const opts = {toJSON : {virtuals:true}};

PhotoSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload", "/upload/w_130");
})

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number, 
        required: true, 
        min: 0,
    }, 
    unit: {
        type: String, 
        required: true, 
        enum:["kg", "l", "pc"]
    }, 
    photos: [PhotoSchema],
    category: {
        type: String, 
        enum: ["Fruit & Nuts", "Vegetables", "Eggs & Dairy", "Salads, Herbs, Oil"]
    },
    about:{
        type: String,
        required: true 
    }
}, opts);

productSchema.virtual("defaultPhoto").get(function(){
    return {url:"https://thumbs.dreamstime.com/b/hand-drawn-vector-illustration-fresh-vegetables-supermarket-grocery-store-organic-vegan-food-64122961.jpg"}
})


const Product = mongoose.model("Product", productSchema); 

module.exports = Product; 

