var express = require('express');
var router = express.Router();

const Book = require('../models').Book

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (err) {
      //res.render("error", {err: err});
      next(err)
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
  res.render('index', { books, title: 'Books' });
}));


/* GET /books/new Shows the create new book form */
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'Create New Book' });
}));

/* POST /books/new Creates a new book to the database */
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books')
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors, title: "Create New Book" })
    } else {
      throw error;
    }
  }
}));

/* GET /books/:id Shows book detail form */
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book, title: book.title });
  } else {
    const err = new Error(`Oops! The page you're looking for does not exist.`);
    err.status = 404;
    res.render('page-not-found', { title: 'Page Not Found', err })
  }

}));


/* POST /books/:id Updates book info in the database */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect('/books')
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }

}));

/* POST /books/:id/delete Deletes a book */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));

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

