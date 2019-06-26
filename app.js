const express = require('express');
const path = require('path');
const sequelize = require("./models").sequelize;

const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

sequelize.sync().then(function(){
  app.listen(process.env.PORT || 3000, () => {
    console.log('The application is running on localhost:3000!');
  });
});
//server.on('error', onError);
//server.on('listening', onListening);
module.exports = app;
