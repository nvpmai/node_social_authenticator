const isLoggedIn = require('./middlewares/isLoggedIn')
const Twitter = require('twitter')
const twitter = require('twitter')
const auth = require('../config/auth')
const then = require('express-then')
const promise = require('songbird')
const flash = require('connect-flash')
const request = require('request')
const networks = {
  twitter: {
    network: {
      icon: 'facebook',
      name: 'Facebook',
      class: 'btn-primary'
    }
  }
}

module.exports = (app) => {
  const twitterConfig = app.config.auth.twitter
  const passport = app.passport

  function getTwitterClient(req) {
    let twitterClient = new Twitter({
      consumer_key: twitterConfig.consumerKey,
      consumer_secret: twitterConfig.consumerSecret,
      access_token_key: req.user.twitter.token,
      access_token_secret: req.user.twitter.tokenSecret
    })
    return twitterClient
  }

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

  app.get('/timeline', isLoggedIn, then(async (req, res) => {
    const twitterClient = getTwitterClient(req)
    let tweets = await twitterClient.promise.get('statuses/home_timeline')
    tweets = tweets.map(tweet => {
      return {
        id: tweet.id_str,
        image: tweet.user.profile_image && tweet.user.profile_image.url,
        text: tweet.text,
        name: tweet.user.name,
        username: '@' + tweet.user.screen_name,
        liked: tweet.favorited,
        network: networks.twitter
      }
    })
    res.render('timeline.ejs', {
      posts: tweets
    })
  }))

  app.get('/compose', isLoggedIn, (req, res) => {
    res.render('compose.ejs', {
      message: req.flash('error')
    })
  })

  app.post('/compose', isLoggedIn, then(async (req, res) => {
    const twitterClient = getTwitterClient(req)
    const status = req.body.reply
    if (status && status.length > 140) {
      req.flash('error', 'Status is over 140 characters')
      res.redirect('/compose')
    }
    else if (!status) {
      req.flash('error', 'Status cannot be empty')
      res.redirect('/compose')
    } else {
      await twitterClient.promise.post('statuses/update', { status }, (err, data) => {
        if (err)
          console.log(err)
        res.redirect('/timeline')
      })
    }
  }))

  app.post('/like/:id', isLoggedIn, then(async (req, res) => {
    const twitterClient = getTwitterClient(req)
    const id = req.params.id
    console.log(id)
    await twitterClient.promise.post('favorites/create', { id }, (err, data) => {
      if (err)
        console.log(err)
      res.end()
    })
  }))

  app.post('/unlike/:id', isLoggedIn, then(async (req, res) => {
    const twitterClient = getTwitterClient(req)
    const id = req.params.id
    await twitterClient.promise.post('favorites/destroy', { id }, () => {
      res.end()
    })
  }))

  app.get('/auth/twitter', passport.authenticate('twitter'))

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { 
      failureRedirect: '/',
      successRedirect: '/timeline' 
    })
  )
}