const mongoose = require("mongoose");
const {Schema} = mongoose;

const OrderSchema = new Schema({
    orderInfo: Object
},{ timestamps: true })

module.exports = mongoose.model("Order", OrderSchema);