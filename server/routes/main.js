const router = require('express').Router();
const async = require('async');
const Category = require('../models/category');
const Item = require('../models/item');


// waste not
// status: good
router.get('/items', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;
  async.parallel([
    function(callback) {
      Item.count({}, (err, count) => {
        var totalItems = count;
        callback(err, totalItems);
      });
    },
    function(callback) {
      Item.find({}).collation({locale:'en',strength: 2}).sort({title:1})
        .skip(perPage * page)
        .limit(perPage)
        .populate('category')
        .exec((err, items) => {
          if(err) return next(err);
          callback(err, items);
        });
    }
  ], function(err, results) {
    var totalItems = results[0];
    var items = results[1];


    res.json({
      success: true,
      message: 'category',
      items: items,
      totalItems: totalItems,
      pages: Math.ceil(totalItems / perPage)
    });
  });

});


// waste not
// status: good
router.get('/itemsRandom', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;
  async.parallel([
    function(callback) {
      Item.count({}, (err, count) => {
        var totalItems = count;
        callback(err, totalItems);
      });
    },
    function(callback) {
      Item.find({}).collation({locale:'en',strength: 2}).sort({title:1})
        .populate('category')
        .exec((err, items) => {
          if(err) return next(err);
          callback(err, items);
        });
    }
  ], function(err, results) {
    var totalItems = results[0];
    var items = results[1];
    shuffle(items);

    res.json({
      success: true,
      message: 'category',
      items: items,
      totalItems: totalItems,
      pages: Math.ceil(totalItems / perPage)
    });
  });

});

function shuffle(array) {

  console.log("333shufffling" );
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }

} // shuffle


//  status GET: good
//  status POST: good
router.route('/categories')
  .get((req, res, next) => {
    Category.find({}, (err, categories) => {
      res.json({
        success: true,
        message: "Success",
        categories: categories
      })
    })
  })
  .post((req, res, next) => {


    Category.find({name: req.body.category}, (err, category) => {
      /* https://stackoverflow.com/questions/23507807/json-object-returns-undefined-value */
      if(category[0]){
        res.json({
          message: category[0].name + " already exists"});
      } else {
        let category = new Category();
        category.name = req.body.category;
        category.save();
        res.json({
          success: true,
          message: "Successful, please refresh the page to see updated changes"
        });
      }
    });
  });

  // waste not
 // status: good

    router.get('/categories/:id', (req, res, next) => {
      const perPage = 10;
      const page = req.query.page;
      async.parallel([
        function(callback) {
          Item.count({ category: req.params.id }, (err, count) => {
            var totalItems = count;
            callback(err, totalItems);

          });
        },
        function(callback) {
          Item.find({ category: req.params.id }).collation({locale:'en',strength: 2}).sort({title:1}) ///
            .skip(perPage * page)
            .limit(perPage)
            .populate('category')
            .exec((err, items) => {
              if(err) return next(err);
              callback(err, items);
            });
        },
        function(callback) {
          Category.findOne({ _id: req.params.id }, (err, category) => {
           callback(err, category)
          });
        }
      ], function(err, results) {
        var totalItems = results[0];
        var items = results[1];
        var category = results[2];
        res.json({
          success: true,
          message: 'category',
          items: items,
          categoryName: category.name,
          totalItems: totalItems,
          pages: Math.ceil(totalItems / perPage)
        });
      });

    });

  // wastenot
// status: good
  router.get('/item/:id', (req, res, next) => {
    Item.findById({ _id: req.params.id })

      .populate('category')
      .exec((err, item) => {
        if (err) {
          res.json({
            success: false,
            message: 'Item is not found'
          });
        } else {
          if (item) {
            res.json({
              success: true,
              item: item
            });
          }
        }
      });
  });


  

  router.delete('/itemDelete/:id', (req, res, next) => {

     //console.log(JSON.stringify(req.body));
     console.log(req.params.id);
     Item.remove({ _id: req.params.id }, function (err){
       if(err) {
         return err;
      } else {

        res.json({
          success: true,
          message: 'Item deleted'
        });
      }
        
     });

  });
  
  /*

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


    // status GET: Good but must be logged in
// status POST: Good 
router.route('/profile')
  .get(checkJWT, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      res.json({
        success: true,
        user: user,
        message: "Successful"
      });
    });
  })
  .post(checkJWT, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) return next(err);

      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      user.isAdmin = req.body.isAdmin;

      user.save();
      res.json({
        success: true,
        message: 'Successfully edited your profile'
      });
    });
  });
*/


router.post('/item/:id', (req, res, next) => {
  Item.findOne({ _id: req.params.id }, (err, item) => {
    if (err) return next(err);

    if (req.body.title) item.title = req.body.title;
    if (req.body.description) item.description = req.body.description;
    if (req.body.image) item.image = req.body.image;
    if(req.body.category) item.category = req.body.category;

    item.save();
    res.json({
      success: true,
      message: 'Successfully edited your item'
    });
  });
});

module.exports = router;
