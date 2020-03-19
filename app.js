var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mysql = require('mysql');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const sessionMiddleware = session({
  store: new FileStore(),
  secret: 'aaaaa',
  cookie: { maxAge: 1000 }
})
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var operationRouter = require('./routes/operation');
var orderRouter = require('./routes/operation/order');
var materialRouter = require('./routes/operation/material');
var scheduleRouter = require('./routes/operation/schedule'); 
var productRouter = require('./routes/operation/product');
var productstockRouter = require('./routes/operation/productstock');
var materialstockRouter = require('./routes/operation/materialstock');
var marketingRouter = require('./routes/marketing');
var customerRouter = require('./routes/Marketing/customer');
var orderpredictRouter = require('./routes/Marketing/OrderPredict');
var customerpredictRouter = require('./routes/Marketing/customerpredict');

var app = express();
var pool= mysql.createPool({
  host:"localhost",
  user:"root",
  password:"vcx45689",
  database:"user"
});

pool.getConnection(function(err){
  if(err){
    console.log('connection error');
    return;
  }
    console.log('connection success');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  req.connection = pool;
  next();
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/operation',operationRouter);
app.use('/order', orderRouter);
app.use('/material',materialRouter);
app.use('/schedule',scheduleRouter);
app.use('/product',productRouter);
app.use('/marketing',marketingRouter);
app.use('/customer',customerRouter);
app.use('/orderpredict',orderpredictRouter);
app.use('/customerpredict',customerpredictRouter);
app.use('/productstock',productstockRouter);
app.use('/materialstock',materialstockRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
/*
var server ,
    ip="140.119.19.46",
    port=3015,
    http=require('http'),
    url=require('url');
    */
module.exports = app;
