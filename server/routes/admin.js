const router = require('express').Router();
const Item = require('../models/item');


const aws = require('aws-sdk'); // aws is a library for communicating with our services, s3
const multer = require('multer'); // multer ia a library for uploading images
const multerS3 = require('multer-s3'); // multer is a library for uploading directly to s3
const s3 = new aws.S3({ accessKeyId: "AKIAJMQNBEXTEX22COGA", secretAccessKey: "VNqW9UXLr84eSgFdUz10yH0WXsFsMu3V6XnDw/eI"});

const faker = require('faker');


const checkJWT = require('../middlewares/check-jwt');

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'amazonowebapplicationcsulb',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

// waste not
// status: GET good
// status: POST good
// In the amazono web app, we have to find the owner of the item,
// but in the zero waste item, there is no sellers so we don't need owners
// However the user must be admin to post or add a new item
  router.route('/items')
    .get(checkJWT, (req, res, next) => {
      Item.find({})
        .populate('category')
        .exec((err, items) => {
          if (items) {
            res.json({
              success: true,
              message: "Items",
              items: items
            });
          }
        });
    })
    .post([checkJWT, upload.single('item_picture')], (req, res, next) => {
      console.log(upload);
      console.log(req.file);
      let item = new Item();
      item.category = req.body.categoryId;
      item.title = req.body.title;
      item.description = req.body.description;
      item.image = req.file.location;
      item.save();
      res.json({
        success: true,
        message: 'Successfully Added the item'
      });
    });

/* Just for testing Waste Not Compost Items */
router.get('/faker/CompostItemTest',(req, res, next) => {
  for (i = 0; i < 20; i++) {
    let item = new Item();
    item.category = "5ace82a94561ae0ecf27a16a"; // compostId
    item.image = faker.image.food();
    item.title = faker.commerce.productName();
    item.description = faker.lorem.words();
    item.save();
  }

  res.json({
    message: "Successfully added 20 compost pictures for testing purposes"
  });

});

module.exports = router;
