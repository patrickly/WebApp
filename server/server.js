// all dependencies that nodejs is using (nodejs acts like a white slate where
// you add dependencies to teach nodejs how to do them)
const express = require('express'); // for rerouting get/post/etc URL
const morgan = require('morgan'); // for login authentication
const bodyParser = require('body-parser'); // for parsing data
const mongoose = require('mongoose'); //for database
const cors = require('cors'); // middleware for communication between client and server / frontend and server
const config = require('./config'); // requirement to establish connection with mlab for mongoose db

const app = express(); // for connecting all the dependencies

// connecting to mongoose db
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


app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/admin', adminRoutes);




app.listen(config.port, (err) => {
  console.log("Server started on port " + config.port);
});
