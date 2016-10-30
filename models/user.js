const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  twitter: {
    id: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    },
    tokenSecret: {
      type: String,
      require: true
    },
    username: {
      type: String,
      require: true
    },
    displayName: {
      type: String,
      require: true
    },
    photos: []
  }
})

module.exports = mongoose.model('User', userSchema)