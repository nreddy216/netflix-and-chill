var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var session = require('express-session');
var User = require('./models/user');
// mongoose.connect('mongodb://localhost/netflixandchill');
mongoose.connect( process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL ||
                  "mongodb://localhost/netflixandchill");

// passport for facebook OAuth
var passport = require('passport');
var cookieParser   = require("cookie-parser");
var session = require('express-session');

// Setting up for config/routes
var routes = require('./config/routes');


// View engine stuff
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'hbs');
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);
hbs.registerPartials(__dirname + '/views/partials');
hbsutils.registerWatchedPartials(__dirname + '/views/partials');

//handlebars helper to see if user is current user
hbs.registerHelper('ifUser', function(lvalue, rvalue, options) {
  if( lvalue._id == rvalue.id ) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

//other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger('dev'));
app.use(cookieParser() ); // requiring cookie parser
app.use(methodOverride('_method'));


//OAUTH and sessions things
// Setting up the Passport Strategies
require("./config/passport")(passport);
app.use(passport.initialize()); // initialization for passport
app.use(passport.session());

//sessions stuff
app.use(
  session({
    secret:'mySecretKey',
    resave: false,
    saveUninitialized: true
  })
);

//extend 'req' to help manage sessions
app.use(function (req, res, next) {
    //login a user
    req.login = function (user) {
      req.session.userId = user._id;
    };
    //find current user
    req.currentUser = function (cb) {
      User.findOne({_id: req.session.userId},
        function (err, user) {
          req.user = user;
          cb(null,user);
        });
    };
    //logout current user
    req.logout = function () {
      req.session.userId = null;
      req.user = null;
    };
    next();
});


/**********
 * SERVER *
 **********/
app.use(routes);
// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
