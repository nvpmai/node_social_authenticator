const TwitterStrategy = require('passport-twitter').Strategy
const User = require('../../models/user')
const auth = require('../../config/auth')
const passport = require('passport')

module.exports = () => {
  passport.serializeUser((user, callback) => {
    callback(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  })

  passport.use(new TwitterStrategy((auth.twitter), 
  (accessToken, refreshToken, profile, callback) => {
    User.find({ 'twitter.id' : profile.id }, function (err, user) {
      if (err) 
        return callback(err)
      if (user && user.length) {
        console.log("FIND USER")
        console.log(user[0])
        return callback(null, user[0])
      }
      else {
        console.log("NOT FIND USER")
        let newUser = new User()
        newUser.twitter.id          = profile.id
        newUser.twitter.token       = accessToken
        newUser.twitter.username    = profile.username
        newUser.twitter.displayName = profile.displayName
        newUser.twitter.photos      = profile.photos;

        newUser.save(function(err) {
          if (err)
            throw err;
          return callback(null, newUser);
        });
      }
    })
  }))

  return passport
}
