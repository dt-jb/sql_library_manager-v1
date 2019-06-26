var express = require('express');
var router = express.Router();

/* GET home page. */
//GET / - Home route should redirect to the /books route.
router.get('/', function(req, res, next) {
  res.redirect("/books")
});

module.exports = router;
