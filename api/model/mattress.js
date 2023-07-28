const mongoose = require("mongoose");
const {Schema} = mongoose;

const MattressSchema = new Schema({
    productInfo: Object,
    images: Array
})

module.exports = mongoose.model("Mattress", MattressSchema);