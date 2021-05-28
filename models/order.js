const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }, 
    basket: {
        type: Object,
        required: true
    }
}); 

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order; 
