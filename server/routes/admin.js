const router = require('express').Router();
const Item = require('../models/item');


const aws = require('aws-sdk'); // aws is a library for communicating with our services, s3
const multer = require('multer'); // multer ia a library for uploading images
const multerS3 = require('multer-s3'); // multer is a library for uploading directly to s3
const s3 = new aws.S3({ accessKeyId: "AKIAJMQNBEXTEX22COGA", secretAccessKey: "VNqW9UXLr84eSgFdUz10yH0WXsFsMu3V6XnDw/eI"});
// s3 key above was deleted on AWS for security reasons

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
    .post(checkJWT, (req, res, next) => {
      let item = new Item();
      item.category = req.body.category;
     // console.log("204 reqbody " + req.body.category);
     // console.log(JSON.stringify(req.body));

    //  console.log("404 title reqbody " + req.body.title);

      item.title = req.body.title;
      item.description = req.body.description;
      item.image = req.body.image;
      item.save();
      res.json({
        success: true,
        message: 'Successfully Added the item',
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



/* Five Waste Not Compost Items */
router.get('/faker/CompostItemFive',(req, res, next) => {
  for (i = 0; i < 5; i++) {
    let item = new Item();
    item.category = "5ace82a94561ae0ecf27a16a"; // compostId
    if(i == 0){
      item.image = "https://i.pinimg.com/originals/ae/c7/d6/aec7d6a5fd9701adbb513887416b8291.jpg";
      item.title = "Pizza boxes";
      item.description = "The pizza box is a folding box made of cardboard in which hot pizzas are stored for takeaway.";

    } else if (i == 1) { 
      item.image = "https://images.pexels.com/photos/45161/teabag-tea-label-drink-45161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
      item.title = "Tea Bags";
      item.description = "A tea bag is a small, porous, sealed bag containing dried plant material, which is immersed in boiling water to make a tea or an infusion.";
    } else if (i == 2) {

      item.image = "https://www.gingercasa.com/wp-content/uploads/2016/11/used-coffee-grounds.jpg";
      item.title = "Coffee Grounds";
      item.description = "Coffee grounds are the waste product from brewing coffee.";
    } else if (i == 3) {
      item.image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQERfb2Nl5NwhzBrKDDrC39VfIMN67uMi8BJ9Ud0tm1WNv0N5cj";
      item.title = "Paper Towel";
      item.description =  "A Paper towel is an absorbent towel made from tissue paper instead of cloth.";

    } else if (i == 4) {
      item.image = "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2014/12/25/1419535813760/2215166779_81043f2d7e_o-2060x1236.jpeg?w=300&q=55&auto=format&usm=12&fit=max&s=fe471b8a145a1c4a89d476ee1123eafd";
      item.title = "Soiled Paper Plates";
      item.description = "Flat vessel on which food can be served";
       
    } else {
      item.image = faker.image.food();
      item.title = faker.commerce.productName();
      item.description = faker.lorem.words();
    }
    item.save();
  }

  res.json({
    message: "Successfully added 5 compost items"
  });

});



/* Six Waste Not Recycle Items */
router.get('/faker/RecycleItemSix',(req, res, next) => {
  for (i = 0; i < 6; i++) {
    let item = new Item();
    item.category = "5ae79d9d027d2834db315428"; // recycleID
    if(i == 0){
      item.image = "https://images.megapixl.com/1778/17788033.jpg";
      item.title = "Cardboard";
      item.description = "A cardboard is a heavy-duty paper-based product.";

    } else if (i == 1) { 
      item.image = "https://st.depositphotos.com/1561359/5117/v/450/depositphotos_51177197-stock-illustration-pile-of-newspaper.jpg";
      item.title = "Newspaper";
      item.description = "A newspaper is a publication printed on paper.";
    } else if (i == 2) {

      item.image = "https://thumbs.dreamstime.com/b/red-crushed-soda-can-empty-smashed-pop-isolated-white-background-71920441.jpg";
      item.title = "Metal (Aluminum)";
      item.description = "Silvery metal object";
    } else if (i == 3) {
      item.image = "https://images.pexels.com/photos/623046/pexels-photo-623046.jpeg?auto=compress&cs=tinysrgb&h=350";
      item.title = "Magazine";
      item.description =  "A magazine is a publication printed on paper.";

    } else if (i == 4) {
      item.image = "https://c7.alamy.com/comp/FTTTAH/carton-milk-packaging-box-on-white-background-blank-paper-pack-for-FTTTAH.jpg";
      item.title = "Carton";
      item.description = "A carton is a box or container usually made of paperboard and sometimes of corrugated fiberboard";
       
    } 
    
    else if (i == 5) {
      item.image = "https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
      item.title = "Plastic Bottle";
      item.description = "A plastic container to hold liquid";
       
    } 
    else {
      item.image = faker.image.food();
      item.title = faker.commerce.productName();
      item.description = faker.lorem.words();
    }
    item.save();
  }

  res.json({
    message: "Successfully added 6 recycle items"
  });

});



/* Five Waste Not Landfill Items */
router.get('/faker/LandfillItemFive',(req, res, next) => {
  for (i = 0; i < 5; i++) {
    let item = new Item();
    item.category = "5ae79d8e027d2834db315427"; // landfillId
    if(i == 0){
      item.image = "https://thumb7.shutterstock.com/display_pic_with_logo/1234523/533316637/stock-vector-blank-flat-poly-clear-bag-filled-plastic-polyethylene-pouch-packaging-with-zipper-ziplock-533316637.jpg";
      item.title = "Zip Lock";
      item.description = "A sealable plastic bag with a two-part strip along the opening that can be pressed together and readily reopened";

    } else if (i == 1) { 
      item.image = "https://c7.alamy.com/comp/CYFDR1/an-empty-25g-bag-of-walkers-cheese-and-onion-crisps-CYFDR1.jpg";
      item.title = "Chip Bag";
      item.description = "A metalized film to hold chips.";
    } else if (i == 2) {

      item.image = "https://image.shutterstock.com/image-photo/candy-foil-without-260nw-542434066.jpg";
      item.title = "Candy Wrapper";
      item.description = "A covering of a candy.";
    } else if (i == 3) {
      item.image = "https://static3.depositphotos.com/1005726/221/i/950/depositphotos_2210080-stock-photo-latex-gloves.jpg";
      item.title = "Latex Glove";
      item.description =  "A natural material, made out of rubber.";

    } else if (i == 4) {
      item.image = "data:image/jpeg;base64,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";
      item.title = "Plastic Coffee Lid";
      item.description = "A lid, also known as a cover, is part of a container, and serves as the closure or seal, usually one that completely closes the object";
       
    } else {
      item.image = faker.image.food();
      item.title = faker.commerce.productName();
      item.description = faker.lorem.words();
    }
    item.save();
  }

  res.json({
    message: "Successfully added 5 landfill items"
  });

});


module.exports = router;
