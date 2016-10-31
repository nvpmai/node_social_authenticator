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
      if (err) {
        return callback(err)
      }
      if (user && user.length) {
        if (user[0].twitter.token !== accessToken) {
          user[0].twitter.token = accessToken
          user[0].twitter.tokenSecret = refreshToken
          user[0].save((err, data) => {
            if (err)
              console.log(err.message)
          })
        }
        return callback(null, user[0])
      }
      else {
        let newUser = new User()
        newUser.twitter.id          = profile.id
        newUser.twitter.token       = accessToken
        newUser.twitter.tokenSecret = refreshToken 
        newUser.twitter.username    = profile.username
        newUser.twitter.displayName = profile.displayName
        newUser.twitter.photos      = profile.photos[0] && profile.photos[0].value;

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
