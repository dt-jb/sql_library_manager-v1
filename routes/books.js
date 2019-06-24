const express = require('express');
const router = express.Router();
const Book = require("../models").Book;

//GET / - Home route should redirect to the /books route.

router.get('/', function(req, res, next) {
  res.redirect("/books")
});

router.get('/', function(req, res, next) {
  Article.findAll({order: [["createdAt", "DESC"]]}).then(function(books){
    res.render('books/index', {books: books, title: 'My Awesome Library' });
  }).catch(function(err){
    res.send(500);
  });
});

//GET /books - Shows the full list of books.

//GET /books/new - Shows the create new book form.
//POST /books/new - Posts a new book to the database.
//GET /books/:id - Shows book detail form.
//POST /books/:id - Updates book info in the database.
//POST /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.





















module.exports = router;
