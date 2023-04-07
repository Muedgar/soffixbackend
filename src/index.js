const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");

const dbSecrets = require("../config/secrets");

const router = require("../api/router/sofarouter");

const app = express();

app.use(cors({credentials: true, origin:  ['https://admin.sofalightbusiness.com','https://www.sofalightbusiness.com','https://sofalightbusiness.com']}));
app.use(express.json());

app.use("/sofalight/backend/api", router);



const start  = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(dbSecrets.MONGO_URI)
  .then(d => {
    app.listen(dbSecrets.PORT, () => {
      console.log("db connected server up and running ...");
    })
  })
  .catch(e => console.log("error message: ", e.message));
}

start();

app.get('/', (req,res) => {
  res.status(200).json({status: "Server is ready..."});
})