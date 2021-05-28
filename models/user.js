const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
    },
    lastName: {
        type:String,
        required:true,
    },
    gender: {
        type:String,
        required:true,
        enum:["male", "female"],
    },
    email: {
        type:String,
        required:true, 
        unique:true
    },
    photo: {
        url:String, 
        filename: String
    },
    streetAddress: {
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    zipCode:{
        type:String,
        required:true,
    }
})

UserSchema.virtual("fullname").get(function(){
    return (this.firstName + " " + this.lastName)
}); 

UserSchema.virtual("anrede").get(function(){
    if (this.gender === "male") {
        return (`Mr. ${this.lastName}`)
    } else return (`Mrs. ${this.lastName}`)
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema); 

module.exports = User; 