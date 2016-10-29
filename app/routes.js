let isLoggedIn = require('./middlewares/isLoggedIn')

module.exports = (app) => {
  let passport = app.passport

  app.get('/', (req, res) => {
    res.render('index.ejs')
  })

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render(profile.ejs)
  })

  app.get('/auth/twitter',
  passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { failureRedirect: '/profile' }),
    function(req, res) {
      // Successful authentication, redirect home.
    res.redirect('/');
  });
}