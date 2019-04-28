var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser =require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose= require('mongoose');
var session = require('express-session');
var indexRouter = require('./routes/index');
require('./models/user');
var MongoStore = require('connect-mongo')(session);
var app = express();
// connect MongoDB
mongoose.connect('mongodb://localhost/pindB', function(err,db){
    if (!err){
        console.log('Connected to /pindB!');
    } else{
        console.dir(err); //failed to connect
    }
});
//Passport
var passport = require('passport');
require('./config/pass')(passport); // pass passport for configuration
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'')));

// express session
app.use(session({
    secret:'secret',
    saveUninitialized : true,
    resave: true,
    store: new MongoStore({mongooseConnection: mongoose.connection}), 
    cookie: {maxAge: 180 * 60 * 1000}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	req.locals.session=req.session;
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

module.exports = app;
