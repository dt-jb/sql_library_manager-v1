const express = require('express');
const path = require('path');
const sequelize = require("./models").sequelize;
const app = express();
const routes = require('./routes/index');
const books = require('./routes/books');

app.set('view engine', 'pug');
app.use('/static', express.static(path.resolve('public')));

app.use('/', routes);
app.use('/book', books);





sequelize.sync().then(function(){
  app.listen(process.env.PORT || 3000, () => {
    console.log('The application is running on localhost:3000!');
  });
});
//server.on('error', onError);
//server.on('listening', onListening);
