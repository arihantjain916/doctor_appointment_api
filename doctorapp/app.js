const express = require("express");
require("dotenv").config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
const {jsonErrorHandler} = require("./middlewares/jsonErrorHandler");


const user = require("./routes/user");

app.use("/api/v1/user",user);




// error handler
app.use(jsonErrorHandler);



module.exports = app;