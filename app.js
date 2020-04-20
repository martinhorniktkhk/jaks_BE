const express = require('express');
const path = require('path');
const favicon = require("serve-favicon");
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// Require routes
const indexRouter = require('./routes/index');
const clientsRouter = require('./routes/clients');
const calendarsRouter = require('./routes/calendars');

const app = express();

// Connect database
mongoose.connect("mongodb://localhost:27017/jaks", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("we're connected!");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

// Mount routes
app.use('/', indexRouter);
app.use('/clients', clientsRouter);
app.use('/calendar', calendarsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
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

module.exports = app;
