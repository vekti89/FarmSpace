const mongoose = require("mongoose");
const Product = require("./product"); 
const Review = require("./review"); 
const cloudinary = require('cloudinary').v2;

//to include virtuals when converting a document to JSON (res.json())
const opts = {toJSON : {virtuals:true}};

const PhotoSchema = new mongoose.Schema({
    url: String,
    filename: String, 
}); 

PhotoSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload", "/upload/w_130");
})

const FarmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },   
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }, 
    location: {
        type: String,
        required: true
    }, 
    photos: [PhotoSchema],
    about: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },  
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },    
    products: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    }], 
    reviews: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Review"
        }]
}, opts)

FarmSchema.virtual("defaultPhoto").get(function(){
    return {url:"https://thumbs.dreamstime.com/b/wooden-farm-house-sketch-vector-illustration-country-engraving-t-shirt-apparel-print-design-scratch-board-imitation-black-172117178.jpg"}
})

FarmSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        });
        const products = await Product.find({
            _id: {
                $in:doc.products
            }
        }); 
        
        //delete all products photos on cloudinary
        products.forEach(function(product) {
            product.photos.forEach(function(photo) {
                console.log(photo.filename)
                cloudinary.uploader.destroy(photo.filename);
            });
        });
    
        await Product.deleteMany({
            _id: {
                $in:doc.products
            }
        })
    }
  });

const Farm = mongoose.model("Farm", FarmSchema); 

module.exports = Farm; 

