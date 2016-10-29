let userSchema = mongoose.Schema({
  twitter: {
    email: {
      type: string,
      required: true
    },
    password: {
      type: string,
      required: true
    }
  }
})