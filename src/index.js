const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");

const dbSecrets = require("../config/secrets");

const router = require("../api/router/sofarouter");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/sofalight/backend/api", router);



const start  = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(dbSecrets.MONGO_URI)
  .then(d => {
    app.listen(dbSecrets.PORT, '0.0.0.0', () => {
      console.log("db connected server up and running ...", dbSecrets.PORT);
    })
  })
  .catch(e => console.log("error message: ", e.message));
}

start();

app.get('/', (req,res) => {
  res.status(200).json({status: "Server is ready..."});
})