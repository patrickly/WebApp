const router = require('express').Router();
const Item = require('../models/item');

const aws = require('aws-sdk'); // aws is a library for communicating with our services, s3
const multer = require('multer'); // multer ia a library for uploading images
const multerS3 = require('multer-s3'); // multer is a library for uploading directly to s3
const s3 = new aws.S3({
  accessKeyId: 'AKIAJMQNBEXTEX22COGA',
  secretAccessKey: 'VNqW9UXLr84eSgFdUz10yH0WXsFsMu3V6XnDw/eI'
});
// s3 key above was deleted on AWS for security reasons

const faker = require('faker');

const checkJWT = require('../middlewares/check-jwt');
const verifyAdmin = require('../middlewares/verifyAdmin');

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'amazonowebapplicationcsulb',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

// waste not
// status: GET good
// status: POST good
// In the amazono web app, we have to find the owner of the item,
// but in the zero waste item, there is no sellers so we don't need owners
// However the user must be admin to post or add a new item
router
  .route('/items')
  .get(checkJWT, (req, res, next) => {
    Item.find({})
      .populate('type')
      .populate('category')
      .exec((err, items) => {
        if (items) {
          res.json({
            success: true,
            message: 'Items',
            items: items
          });
        }
      });
  })
  .post(checkJWT, verifyAdmin, (req, res, next) => {
    let item = new Item();
    item.type = req.body.type;
    item.bin = req.body.bin
    //   console.log("204 reqbody " + req.body.bin);
    // console.log(JSON.stringify(req.body));

    // console.log("404 title reqbody " + req.body.title);

    item.title = req.body.title;
    item.description = req.body.description;
    item.image = req.body.image;
    item.correctAnswerFeedback = req.body.correctAnswerFeedback;
    item.tipCompostWrong = req.body.tipCompostWrong;
    item.tipRecycleWrong = req.body.tipRecycleWrong;
    item.tipLandfillWrong = req.body.tipLandfillWrong;
    if (req.body.isCompostAndLandfill == "") {
      item.isCompostAndLandfill = false;
    } else {
      item.isCompostAndLandfill = req.body.isCompostAndLandfill;
    }

    console.log("205 reqbody.isCandL " + (req.body.isCompostAndLandfill == ""));
    console.log(JSON.stringify(req.body));
    item.save();
    res.json({
      success: true,
      message: 'Successfully Added the item'
    });
  });

module.exports = router;
