var express = require('express');
var router = express.Router();

const Book = require('../models').Book

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (err) {
      res.render("error", {error: err});
    }
  }
}


router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
console.log("books",books )
  //res.render('books', { books, title: 'Books'})
  
    // res.render('index', { title: 'Express' });
  }));
  

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
