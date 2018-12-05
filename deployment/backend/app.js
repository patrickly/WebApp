const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/account');
const adminRoutes = require('./routes/admin');
//const itemSearchRoutes = require('./routes/item-search');

const app = express();

mongoose
  .connect(
    "mongodb://csulbDevs:491@ds117539.mlab.com:17539/wastenotwebapp"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});



app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/admin', adminRoutes);
//app.use('/api/search', itemSearchRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});
module.exports = app;
