// //
// //    SUBJECT TO CHANGE ACCORDINGLY
// //

var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;

//comment out when deploying to heroku
// var OAuth = require('../secrets');


module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    // console.log("user_id", user._id);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      // console.log('deserializing user:',user);
      done(err, user);
    });
  });

  passport.use('facebook', new FacebookStrategy({
    clientID        : process.env.CLIENTID || OAuth.fb.clientID,
    clientSecret    : process.env.CLIENTSECRET || OAuth.fb.clientSecret,
    callbackURL     : '/auth/facebook/callback',
    enableProof     : true,
    profileFields   : ['name', 'emails', 'gender', 'birthday', 'picture.type(large)']
  }, function(access_token, refresh_token, profile, done) {

    process.nextTick(function() {

      User.findOne({ 'facebookID' : profile.id }, function(err, user) {
        if (err) {
          console.log("ERROR");
          return done(err);
        } else if (user) {
          console.log("FOUND FB USER");
          return done(null, user);
        } else {

          var user = new User();
          user.facebookID   = profile.id;
          user.access_token = access_token;
          user.firstName    = profile.name.givenName;
          user.lastName     = profile.name.familyName;
          user.email        = profile.emails[0].value;
          user.birthday     = profile._json.birthday;
          user.gender       = profile.gender;
          user.profilePic   = profile.photos[0].value;


          user.save(function(err) {
            if (err)
              throw err;

            return done(null, user);
          });
        }

      });
    });
  }));

};
