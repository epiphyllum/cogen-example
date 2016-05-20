var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var Promise = require('bluebird');
var restler = require('restler-bluebird');
var co = require('co');
var service = require('./nock/mock_service');

// 
app.get('/complex', function(req, res){
   console.log("complex get called!!!");
   var flow = function*() {
        var all = yield Promise.all([
            restler.get('http://localhost:3000/a'),
            restler.get('http://localhost:3000/b'),
            restler.get('http://localhost:3000/op')]
        );

        console.dir(all);   // ok!!!!!

        var c;
        if ( all[2].op == 'sub') {
            c = yield restler.post('http://localhost:3000/sub', {data: { a: all[0].a, b: all[1].b }});
        } else {
            console.log("here called");
            c = yield restler.post('http://localhost:3000/add', {data: { a: all[0].a, b: all[1].b}});
        }

        var vm = {
          a: all[0].a,
          b: all[1].b,
          c: c.c,
          op:all[2].op 
        };
        console.dir(vm);

        res.json(vm);
    }
    co(flow);  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
