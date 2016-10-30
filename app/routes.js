const isLoggedIn = require('./middlewares/isLoggedIn')
const Twitter = require('passport-twitter').Strategy
const passport = require('passport')
const promise = require('promise')
const twitter = require('twitter')
const then = require('express-then')
const auth = require('../config/auth')
const posts = require('../data/posts')
require('songbird')


module.exports = (app) => {
  const twitterConfig = app.config.auth.twitter
  const passport = app.passport

  app.get('/', (req, res) => {
    res.render('index.ejs')
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user,
      message: req.flash('error')
    })
  })

  app.get('/timeline', isLoggedIn, (req, res) => {
    let twitterClient = new Twitter({
      consumer_key: twitterConfig.consumer_key,
      consumer_secret: twitterConfig.consumer_secret,
      access_token_key: req.user.twitter.token,
      access_token_secret: req.user.twitter.tokenSecret
    })

    await twitterClient.promise.get('home_timeline')
    res.render('timeline.ejs', {
      posts: posts
    })
  })

  app.get('/auth/twitter', passport.authenticate('twitter'))

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { 
      failureRedirect: '/',
      successRedirect: '/timeline' 
    })
  )
}