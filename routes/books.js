const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Book = require("../models").Book;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//GET /books - Shows the full list of books.
router.get('/', (req, res, next) => {
  const pageSize = 10;
  let numOfPages;
  let currentPage = req.query.page;
  if(currentPage === undefined) {
    currentPage = 1;
  }
  let offset = (currentPage - 1) * pageSize;
  let limit = 10;
  Book.findAll({offset, limit, order: [["title", "DESC"]]}).then(books => {
    console.log(`offset = ${offset}, limit = ${limit}, currentPage = ${currentPage}, books.length = ${books.length}`);
    res.render('books/index', {books, title: "Books List", currentPage});
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
router.get('/:id/update', (req, res) => {
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
router.post('/:id/update', (req, res) => {
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

router.get('/search', (req, res) => {
  const { term } = req.query;
  Book.findAll({ where: {
                    [Op.or]: [{title: { [Op.like]: `%${term}%` }}, {author: { [Op.like]: `%${term}%` }}, {genre: { [Op.like]: `%${term}%` }}]
                  }
    }).then( books => {
      res.render('books/search-results', {books});
    }).catch( err => {
    res.render('error', err);
  });
});


module.exports = router;
