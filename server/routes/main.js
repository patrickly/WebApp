const router = require('express').Router();
const async = require('async');
const Bin = require('../models/bin');
const Item = require('../models/item');
const Type = require('../models/type');

const checkJWT = require('../middlewares/check-jwt');
const verifyAdmin = require('../middlewares/verifyAdmin');


router.get('/items', (req, res, next) => {
  const perPage = 50;
  const page = req.query.page;
  async.parallel(
    [
      function (callback) {
        Item.count({}, (err, count) => {
          var totalItems = count;
          callback(err, totalItems);
        });
      },
      function (callback) {
        Item.find({})
          .collation({ locale: 'en', strength: 2 })
          .sort({ title: 1 })
          .skip(perPage * page)
          .limit(perPage)
          .populate('bin')
          .populate('type')
          .exec((err, items) => {
            if (err) return next(err);
            callback(err, items);
          });
      }
    ],
    function (err, results) {
      var totalItems = results[0];
      var items = results[1];

      res.json({
        success: true,
        message: 'bin',
        items: items,
        totalItems: totalItems,
        pages: Math.ceil(totalItems / perPage)
      });
    }
  );
});


router.get('/itemsAll', (req, res, next) => {
  const perPage = 100000;
  const page = req.query.page;
  async.parallel(
    [
      function (callback) {
        Item.count({}, (err, count) => {
          var totalItems = count;
          callback(err, totalItems);
        });
      },
      function (callback) {
        Item.find({})
          .collation({ locale: 'en', strength: 2 })
          .sort({ title: 1 })
          .skip(perPage * page)
          .limit(perPage)
          .populate('bin')
          .populate('type')
          .exec((err, items) => {
            if (err) return next(err);
            callback(err, items);
          });
      }
    ],
    function (err, results) {
      var totalItems = results[0];
      var items = results[1];

      res.json({
        success: true,
        message: 'bin',
        items: items,
        totalItems: totalItems,
        pages: Math.ceil(totalItems / perPage)
      });
    }
  );
});



router.get('/itemsRandom', (req, res, next) => {
  const perPage = 100000;
  const page = req.query.page;
  async.parallel(
    [
      function (callback) {
        Item.count({}, (err, count) => {
          var totalItems = count;
          callback(err, totalItems);
        });
      },
      function (callback) {
        Item.find({})
          .collation({ locale: 'en', strength: 2 })
          .sort({ title: 1 })
          .populate('bin')
          .exec((err, items) => {
            if (err) return next(err);
            callback(err, items);
          });
      }
    ],
    function (err, results) {
      var totalItems = results[0];
      var items = results[1];
      shuffle(items);

      res.json({
        success: true,
        message: 'bin',
        items: items,
        totalItems: totalItems,
        pages: Math.ceil(totalItems / perPage)
      });
    }
  );
});

function shuffle(array) {
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
router
  .route('/bins')
  .get((req, res, next) => {
    Bin.find({}, (err, bins) => {
      res.json({
        success: true,
        message: 'Success',
        bins: bins
      });
    });
  })
  .post((req, res, next) => {
    Bin.find({ name: req.body.bin }, (err, bin) => {
      if (bin[0]) {
        res.json({
          message: bin[0].name + ' already exists'
        });
      } else {
        let bin = new Bin();
        bin.name = req.body.bin;
        bin.save();
        res.json({
          success: true,
          message: 'Successful, please refresh the page to see updated changes'
        });
      }
    });
  });

router
  .route('/types')
  .get((req, res, next) => {
    Type.find({}, (err, types) => {
      res.json({
        success: true,
        message: 'Success',
        types: types
      });
    });
  })
  .post((req, res, next) => {
    Type.find({ name: req.body.type }, (err, type) => {
      if (type[0]) {
        res.json({
          message: type[0].name + ' already exists'
        });
      } else {
        let type = new type();
        type.name = req.body.type;
        type.save();
        res.json({
          success: true,
          message: 'Successful, please refresh the page to see updated changes'
        });
      }
    });
  });



router.get('/bins/:id', (req, res, next) => {
  const perPage = 50;
  const page = req.query.page;

  async.parallel(
    [
      function (callback) {
        Item.count({ bin: req.params.id }, (err, count) => {
          var totalItems = count;
          callback(err, totalItems);
        });
      },
      function (callback) {
        Item.find({ bin: req.params.id })
          .collation({ locale: 'en', strength: 2 })
          .sort({ title: 1 }) ///
          .skip(perPage * page)
          .limit(perPage)
          .populate('bin')
          .exec((err, items) => {
            if (err) return next(err);
            callback(err, items);
          });
      },
      function (callback) {
        Bin.findOne({ _id: req.params.id }, (err, bin) => {
          callback(err, bin);
        });
      }
    ],
    function (err, results) {
      var totalItems = results[0];
      var items = results[1];
      var bin = results[2];
      res.json({
        success: true,
        message: 'bin',
        items: items,
        binName: bin.name,
        totalItems: totalItems,
        pages: Math.ceil(totalItems / perPage)
      });
    }
  );
});

router.get('/types/:id', (req, res, next) => {
  const perPage = 50;
  const page = req.query.page;
  async.parallel(
    [
      function (callback) {
        Item.count({ type: req.params.id }, (err, count) => {
          var totalItems = count;
          callback(err, totalItems);
        });
      },
      function (callback) {
        Item.find({ type: req.params.id })
          .collation({ locale: 'en', strength: 2 })
          .sort({ title: 1 }) ///
          .skip(perPage * page)
          .limit(perPage)
          .populate('type')
          .exec((err, items) => {
            if (err) return next(err);
            callback(err, items);
          });
      },
      function (callback) {
        Type.findOne({ _id: req.params.id }, (err, type) => {
          callback(err, type);
        });
      }
    ],
    function (err, results) {
      var totalItems = results[0];
      var items = results[1];
      var bin = results[2];
      res.json({
        success: true,
        message: 'type',
        items: items,
        binName: bin.name,
        totalItems: totalItems,
        pages: Math.ceil(totalItems / perPage)
      });
    }
  );
});


router.get('/item/:id', (req, res, next) => {
  Item.findById({ _id: req.params.id })
    .populate('bin')
    .populate('type')
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

router.delete('/itemDelete/:id', checkJWT, verifyAdmin, (req, res, next) => {
  Item.remove({ _id: req.params.id }, function (err) {
    if (err) {
      return err;
    } else {
      res.json({
        success: true,
        message: 'Item deleted'
      });
    }
  });
});



router.post('/item/:id', checkJWT, verifyAdmin, (req, res, next) => {
  Item.findOne({ _id: req.params.id }, (err, item) => {
    if (err) return next(err);

    if (req.body.title) item.title = req.body.title;
    if (req.body.description) item.description = req.body.description;
    if (req.body.image) item.image = req.body.image;
    if (req.body.type) item.type = req.body.type;
    if (req.body.bin) item.bin = req.body.bin;
    if (req.body.isCompostAndLandfill) {
      item.isCompostAndLandfill = req.body.isCompostAndLandfill;
    } else {
      item.isCompostAndLandfill = false;
    }

    if (req.body.tipCompostWrong) {
      item.tipCompostWrong = req.body.tipCompostWrong;
    } else {
      item.tipCompostWrong = "";

    }


    if (req.body.tipRecycleWrong) {
      item.tipRecycleWrong = req.body.tipRecycleWrong;

    } else {
      item.tipRecycleWrong = "";
    }


    if (req.body.tipLandfillWrong) {
      item.tipLandfillWrong = req.body.tipLandfillWrong;
    } else {
      item.tipLandfillWrong = "";

    }

    if (req.body.correctAnswerFeedback) {
      item.correctAnswerFeedback = req.body.correctAnswerFeedback;
    } else {
      item.correctAnswerFeedback = "";

    }


    item.save();
    res.json({
      success: true,
      message: 'Successfully edited your item'
    });
  });
});

module.exports = router;
