const Farm = require("../models/farm"); 
const User = require("../models/user"); 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN; 
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});
const cloudinary = require('cloudinary').v2;

module.exports.index = async (req, res)=>{
    const farms = await Farm.find({}); 
    res.render("farms/index", {farms}); 
}

module.exports.renderNewForm = (req, res)=>{
    res.render("farms/new")};

module.exports.createFarm = async(req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.farm.location, 
        limit:1,
        autocomplete:false, 
    }).send() 
    const farm = new Farm(req.body.farm);
    if(!geoData.body.features.length){
        req.flash("error", "Please provide a valid and precise address for better positioning in the Bay area.");
        farm.geometry = { type: 'Point', coordinates: [ -122.70560000206426, 37.94353584086352] };
    } else {
    farm.geometry = geoData.body.features[0].geometry;
    }
    farm.photos = req.files.map(f => ({url:f.path, filename: f.filename}));
    farm.owner = req.user._id;
    await farm.save(); 
    req.flash("success", "Your farm has been registered!");
    res.redirect(`/farms/${farm._id}`); 
}

module.exports.renderEditForm = async (req, res)=>{
    const {id} = req.params; 
    const farm = await Farm.findById(id);
    if(!farm){
        req.flash("error", "Cannot find that farm..."); 
        return res.redirect("/farms"); 
    }
    res.render("farms/edit", {farm})
}

module.exports.editFarm = async (req, res)=>{
    const {id} = req.params; 
    const farm = await Farm.findByIdAndUpdate(id, {...req.body.farm});
    const geoData = await geocoder.forwardGeocode({
        query: req.body.farm.location, 
        limit:1,
        autocomplete:false, 
    }).send(); 
    if(!geoData.body.features.length){
        req.flash("error", "Please provide a valid and precise address for better positioning in the Bay area.");
        farm.geometry = { type: 'Point', coordinates: [ -122.70560000206426, 37.94353584086352] };
    } else {
    farm.geometry = geoData.body.features[0].geometry;
    }
    const photos = req.files.map(f => ({url:f.path, filename: f.filename}));
    farm.photos.push(...photos);  
    await farm.save(); 
    if (req.body.deletePhotos){
        for(let filename of req.body.deletePhotos){
            await cloudinary.uploader.destroy(filename);
        }
        await farm.updateOne({$pull:{
            photos: {filename: {$in:req.body.deletePhotos}}}})}
    req.flash("success", `${farm.name} has been updated.`);
    res.redirect(`/farms/${farm._id}`)
}

module.exports.deleteFarm = async(req,res)=>{
    const {id} = req.params; 
    const farm = await Farm.findById(id).populate("products"); 
    for(let photo of farm.photos){
        await cloudinary.uploader.destroy(photo.filename); 
    } 
    const deleted = await Farm.findByIdAndDelete(id);
    req.flash("success", `${farm.name} has been deleted.`);
    res.redirect("/farms");
}

module.exports.ownerPage = async(req, res)=>{
    const {id, ownerId} = req.params; 
    const farm = await Farm.findById(id); 
    const owner = await User.findById(ownerId); 
    console.log(farm, owner); 
    res.render("farms/ownerPage", {farm, owner}); 
}

module.exports.showPage = async (req, res)=> {
    const {id} = req.params; 
    const farm = await Farm.findById(id).populate("owner").populate("products").populate({
        path:"reviews", 
        populate: {
            path: "author"
        }
    });
    if(!farm){
        req.flash("error", "Cannot find that farm...");
        return res.redirect("/farms")
    }
    res.render("farms/show", {farm})
}