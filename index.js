const express = require('express')
const flash = require('connect-flash')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter')
const path = require('path')
const auth = require('./config/auth')

const PORT = 8000
const app = express(), port = PORT
passport.use(new TwitterStrategy((auth.twitter), 
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
}))

require('./app/routes')(app)

app.set('views', path.join(__dirname, 'views'))
app.set('views engine', 'ejs')
app.use(flash())

app.listen(PORT, () => console.log(`Listening @ http://localhost:${port}`))