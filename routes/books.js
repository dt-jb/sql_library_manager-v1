const express = require('express');
const router = express.Router();
const Book = require("../models").Book;

//GET /books - Shows the full list of books.
router.get('/', (req, res, next) => {
  Book.findAll({order: [["title", "DESC"]]}).then(books => {
    //console.log(books);
    res.render('books/index', {books});
    //res.render('index', {books: books, title: 'My Awesome Library' });
  }).catch(function(err){
    res.sendStatus(500);
  });
});

//GET /books/new - Shows the create new book form.
router.get('/new', (req, res, next) => {
    res.render('books/new-book', {book: Book.build(), title: "Add a book"});
});

//POST /books/new - Posts a new book to the database.
router.post('/new', (req, res, next) => {
  Book.create(req.body).then((book) => {
    res.redirect("/book");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      res.render('books/new-book', {
        book: Book.build(req.body),
        title: "Add book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.send(500);
  });
});
//GET /books/:id - Shows book detail form.
//POST /books/:id - Updates book info in the database.
//POST /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.

module.exports = router;
