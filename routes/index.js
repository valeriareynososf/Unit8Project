var express = require('express');
var router = express.Router();

const Book = require('../models').Book

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (err) {
      console.log("catch",err)
      res.render("error", {err: err});
      //res.status(500).send(err)
    }
  }
}

/* GET / Home route should redirect to the /books route */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));


/* GET /books Shows the full list of books */
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('books', { index, title: 'Books' });
}));


/* GET /books/new Shows the create new book form */
router.get('/books', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
}));

/* POST /books/new Posts a new book to the database */
router.get('/books', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
}));

/* GET /books/:id Shows book detail form */
router.get('/books', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
}));


/* POST /books/:id Updates book info in the database */
router.get('/books', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
}));

/* POST /books/:id/delete Deletes a book */
router.get('/books', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
}));

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// 404 handler
router.use((req, res, next) => {
  const err = new Error(`Oops! The page you're looking for does not exist.`);
  err.status = 404;
  next(err);
})

// Global error handler
router.use((err, req, res, next) => {
  if (err) {
    console.log(`${err.status} - ${err.message}`)
  }
  if (err.status === 404) {
    console.log(err.message)
    res.status(404).render('page-not-found', { title: 'Page Not Found', err })
  } else {
    err.message = err.message || `Sorry! There was an unexpected error on the server.`;
    res.status(err.status || 500).render('error', { title: 'Page Not Found', err })
  }
})


module.exports = router;

