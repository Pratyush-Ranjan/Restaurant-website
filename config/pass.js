// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

	passport.use('local-login', new LocalStrategy(
	  function(username, password, done) {
	    User.findOne({
	      username: username
	    }, function(err, user) {
	      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { er_message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { er_message: 'Incorrect password.' });
      }
      return done(null, user);
	    });
	  }
	));
};