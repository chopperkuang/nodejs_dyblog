var mongoose = require('mongoose')
	, LocalStrategy = require('passport-local').Strategy
	, User = mongoose.model('User')
	

exports.boot = function (passport, config) {
 	//require('./initializer')
	
	// serialize sessions
	passport.serializeUser(function(user, done) {
	  done(null, user.id)
	})
	
	passport.deserializeUser(function(id, done) {
	  User.findOne({ _id: id }, function (err, user) {
	    done(err, user)
	  })
	})
	
	// use local strategy
	passport.use(new LocalStrategy({
	    usernameField: 'email',
	    passwordField: 'password'
	  },
	  function(email, password, done) {
		
	    User.findOne({ email: email }, function (err, user) {
	      if (err) { return done(err) }
	      if (!user) {
	        return done(null, false, { message: 'Unknown user' })
	      }
		  console.log("password ==>" + password);
	      if (!user.authenticate(password)) {
	        return done(null, false, { message: 'Invalid password' })
	      }
		  console.log("LocalStrategy OK ==>" + user.name);
	      return done(null, user)
	    })
	  }
	))
}