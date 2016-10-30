const express = require('express')
const flash = require('connect-flash')
const passportMiddleware = require('./app/middlewares/passport')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')

const PORT = 8000
const DB = require('./config/database')
const app = express(), port = PORT

app.passport = passportMiddleware()

// connect to the database
mongoose.connect(DB.development.url)

app.set('views', path.join(__dirname, 'views'))
app.set('views engine', 'ejs')

app.use(cookieParser('ilovethenodejs'))
// persistent login sessions

app.use(session({
  secret: 'ilovethenodejs',
  resave: true,
  saveUninitialized: true
}))

app.use(app.passport.initialize())
app.use(app.passport.session())

// configure routes
require('./app/routes')(app)

app.listen(PORT, () => console.log(`Listening @ http://localhost:${port}`))