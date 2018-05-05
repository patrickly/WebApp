const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');

const app = express();

mongoose.connect(config.database, err => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/account');
const adminRoutes = require('./routes/admin');
const itemSearchRoutes = require('./routes/item-search');


app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', itemSearchRoutes);




app.listen(config.port, (err) => {
  console.log("Server started on port " + config.port);
});
