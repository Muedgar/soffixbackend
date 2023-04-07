const mongoose = require("mongoose");
const {Schema} = mongoose;

const ProductSchema = new Schema({
    productInfo: Object,
    images: Array
})

module.exports = mongoose.model("Product", ProductSchema);