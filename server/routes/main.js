const router = require('express').Router();
const async = require('async');
const Category = require('../models/category');
const Product = require('../models/product');
const Item = require('../models/item');


// amazono
router.get('/products', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;
  async.parallel([
    function(callback) {
      Product.count({}, (err, count) => {
        var totalProducts = count;
        callback(err, totalProducts);
      });
    },
    function(callback) {
      Product.find({})
        .skip(perPage * page)
        .limit(perPage)
        .populate('category')
        .populate('owner')
        .exec((err, products) => {
          if(err) return next(err);
          callback(err, products);
        });
    }
  ], function(err, results) {
    var totalProducts = results[0];
    var products = results[1];

    res.json({
      success: true,
      message: 'category',
      products: products,
      totalProducts: totalProducts,
      pages: Math.ceil(totalProducts / perPage)
    });
  });

});

// waste not
// status: not tested yet
router.get('/itemsZ', (req, res, next) => {
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
      Item.find({})
        .skip(perPage * page)
        .limit(perPage)
        .populate('category')
        .populate('owner')
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

// amazono

  router.get('/categories/:id', (req, res, next) => {
    const perPage = 10;
    const page = req.query.page;
    async.parallel([
      function(callback) {
        Product.count({ category: req.params.id }, (err, count) => {
          var totalProducts = count;
          callback(err, totalProducts);
        });
      },
      function(callback) {
        Product.find({ category: req.params.id })
          .skip(perPage * page)
          .limit(perPage)
          .populate('category')
          .populate('owner')
          .exec((err, products) => {
            if(err) return next(err);
            callback(err, products);
          });
      },
      function(callback) {
        Category.findOne({ _id: req.params.id }, (err, category) => {
         callback(err, category)
        });
      }
    ], function(err, results) {
      var totalProducts = results[0];
      var products = results[1];
      var category = results[2];
      res.json({
        success: true,
        message: 'category',
        products: products,
        categoryName: category.name,
        totalProducts: totalProducts,
        pages: Math.ceil(totalProducts / perPage)
      });
    });

  });

  // waste not
 // status: good

    router.get('/categoriesZ/:id', (req, res, next) => {
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
          Item.find({ category: req.params.id })
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


    // amazono

  router.get('/product/:id', (req, res, next) => {
    Product.findById({ _id: req.params.id })
      .populate('category')
      .populate('owner')
      .exec((err, product) => {
        if (err) {
          res.json({
            success: false,
            message: 'Product is not found'
          });
        } else {
          if (product) {
            res.json({
              success: true,
              product: product
            });
          }
        }
      });
  });

  // wastenot
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

module.exports = router;
