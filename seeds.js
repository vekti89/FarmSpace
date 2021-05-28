//const { Db } = require("mongodb");
const mongoose = require("mongoose");
const Farm = require("./models/farm"); 
const Product = require("./models/product"); 

mongoose.connect('mongodb://localhost:27017/farmApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("MONGO CONNECTION OPEN!")
})
.catch((err)=>{
    console.log("MONGO CONNECTION ERROR: ", err)
})

const seedFarms = [
    {
        name: "First Farm", 
        location: "Colorado, USA",
        contact: "firstfarm@gmail.com", 
        owner: "FirstMan",
        photo: "https://store-images.s-microsoft.com/image/apps.16734.14361827347269538.6f428d95-af36-4d05-800a-b38a213de88b.6889fc62-5219-465f-9df6-acf11e93e47d?mode=scale&q=90&h=1080&w=1920",
        

    },
    {
        name: "Second Farm", 
        location: "Colorado, USA",
        contact: "secondfarm@gmail.com", 
        owner: "SecondMan",
        photo: "https://store-images.s-microsoft.com/image/apps.16734.14361827347269538.6f428d95-af36-4d05-800a-b38a213de88b.6889fc62-5219-465f-9df6-acf11e93e47d?mode=scale&q=90&h=1080&w=1920",
       
    },
    {
        name: "Third Farm", 
        location: "Colorado, USA",
        contact: "thirdfarm@gmail.com", 
        owner: "ThirdMan",
        photo: "https://store-images.s-microsoft.com/image/apps.16734.14361827347269538.6f428d95-af36-4d05-800a-b38a213de88b.6889fc62-5219-465f-9df6-acf11e93e47d?mode=scale&q=90&h=1080&w=1920",
        
    }
];

/*Farm.insertMany(seedFarms)
.then (res => {
    console.log(res)
})
.catch(err=>{
    console.log(err)
}); 

Product.insertMany([
    {name:"Goddess Melon", price:4.99, category:"vegetable", photo:"https://gardenerspath.com/wp-content/uploads/2020/07/Sarahs-Choice.jpg"},
    {name:"Sugar Baby Watermelon", price:5.00, category:"fruit", photo:"https://www.gardeningknowhow.com/wp-content/uploads/2014/08/sugar-baby.jpg"},
    {name:"Tomato", price:2.99, category:"fruit", photo:"https://www.notcutts.co.uk/wordpress/wp-content/uploads/2018/08/grow-your-own-tomatoes-f.jpg"},
]).then (res => {
    console.log(res)
})
.catch(err=>{
    console.log(err)
}); */

/*const addProduct = async()=>{
    const farm = await Farm.findOne({name:"First Farm"});
    const tomato = await Product.findOne({name:"Tomato"});
    const goddessMelon = await Product.findOne({name:"Goddess Melon"});
    farm.products.push(tomato);
    farm.products.push(goddessMelon);
    await farm.save();
    console.log(farm);
}

addProduct();*/

/*const addFarm = async()=>{
    const farm = await Farm.findOne({name:"First Farm"});
    const tomato = await Product.findOne({name:"Tomato"});
    const goddessMelon = await Product.findOne({name:"Goddess Melon"});
    tomato.farm = farm; 
    goddessMelon.farm = farm; 
    await tomato.save();
    await goddessMelon.save();
    console.log(tomato, goddessMelon);
}

addFarm();
*/