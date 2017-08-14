var express = require('express');
var path = require('path');
var multer = require('multer');
var bodyParser = require('body-parser')
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var notification = require('./routes/notification');
var cities = require('./routes/cities');
var categories = require('./routes/categories');
var privileges = require('./routes/privileges');
var follow = require('./routes/follow');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    bodyParser.json()
    next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/notifications', notification);
app.use('/users', users);
app.use('/cities',cities);
app.use('/categories',categories);
app.use('/privileges',privileges);
app.use('/follow',follow);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
