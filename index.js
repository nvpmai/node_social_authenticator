require('./bootstrap')
const express = require('express')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const requireDir = require('require-dir')
const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'development'
const PORT = 8000
const DB = require('./config/database')
const config = requireDir('./config', { recurse: true })
const app = express(), port = PORT

app.passport = require('./app/middlewares/passport')()
app.config = {
  auth: config.auth, 
  database: config.database[NODE_ENV]
}

// connect to the database
mongoose.connect(DB.development.url)
app.use(cookieParser('ilovethenodejs'))
app.use(bodyParser.json()) // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, 'views'))
app.set('views engine', 'ejs')

// persistent login sessions

app.use(session({
  secret: 'ilovethenodejs',
  resave: true,
  saveUninitialized: true
}))

// Setup passport authentication middleware
app.use(app.passport.initialize())
// persistent login sessions
app.use(app.passport.session())
// Flash messages stored in session
app.use(flash())

// configure routes
require('./app/routes')(app)

app.listen(PORT, () => console.log(`Listening @ http://localhost:${port}`))