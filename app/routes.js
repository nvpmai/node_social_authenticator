const isLoggedIn = require('./middlewares/isLoggedIn')
const TwitterStrategy = require('passport-twitter')
const passport = require('passport')
const auth = require('../config/auth')

module.exports = (app) => {
  const passport = app.passport

  app.get('/', (req, res) => {
    res.render('index.ejs')
  })

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('../views/profile.ejs'), {
      user: req.user,
    }
  })

  app.get('/auth/twitter', passport.authenticate('twitter'))

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { 
      failureRedirect: '/',
      successRedirect: '/profile' 
    })
  )
}