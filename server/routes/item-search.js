/*
const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('PHBBHP1WCG', '80528809550065a09f7443b98c55ad44');
const index = client.initIndex('wastenot');

router.get('/', (req, res, next) => {
  if (req.query.query) {
    index.search(
      {
        query: req.query.query,
        page: req.query.page
      },
      (err, content) => {
        res.json({
          success: true,
          message: 'Here is your search',
          status: 200,
          content: content,
          search_result: req.query.query
        });
      }
    );
  }
});

module.exports = router;
*/