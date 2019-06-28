const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Book = require("../models").Book;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//GET /books - Shows the full list of books.
router.get('/', (req, res, next) => {
  Book.findAll({order: [["title", "DESC"]]}).then(books => {
    console.log(req.body);
    res.render('books/index', {books});
    //res.render('index', {books: books, title: 'My Awesome Library' });
  }).catch( err => {
    res.render('error', err);
  });
});

//GET /books/new - Shows the create new book form.
router.get('/new', (req, res, next) => {
    res.render('books/new-book', {book: Book.build(), title: "Add Book"});
});

//POST /books/new - Posts a new book to the database.
router.post('/new', (req, res, next) => {
  console.log(req.body);
  Book.create(req.body).then(() => {
    res.redirect("/");
  }).catch( err => {
    if(err.name === "SequelizeValidationError"){
      res.render('books/new-book', {
        book: Book.build(req.body),
        title: "Add book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch( err => {
    res.render('error', err);
  });
});

//GET /books/:id - Shows book detail form.
router.get('/:id', (req, res) => {
    Book.findByPk(req.params.id).then( book => {
      if(book){
        res.render('books/update-book', {book: book, title: 'Edit Book'});
      } else {
        res.render('books/page-not-found');
      }
    }).catch( err => {
      res.render('error', err);
    });
  });

//POST /books/:id - Updates book info in the database.
router.post('/:id', (req, res) => {
  Book.create(req.body).then(() => {
    res.redirect("/");
  }).catch( err => {
    if(err.name === "SequelizeValidationError"){
      res.render('books/update-book', {
        book: Book.build(req.body),
        title: "Edit book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch( err => {
    res.render('error', err);
  });
});

//POST /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post('/:id/delete', (req, res, next) => {
  Book.findByPk(req.params.id).then( book => {
    if(book){
      return book.destroy();
    } else {
      res.render('books/page-not-found');
    }
  }).then( () => {
    res.redirect("/books");
  }).catch( err => {
    res.render('error', err);
  });
});


module.exports = router;
