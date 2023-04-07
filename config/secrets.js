require("dotenv").config();

let dbSecrets = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT
}

module.exports = dbSecrets;