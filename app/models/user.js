var mongoose = require('mongoose')
	, Schema = mongoose.Schema	

var UserSchema = new Schema({
      name: String
  	, email: String
  	, username: String
	, password: String
  	, hashed_password: String
  	, salt: String
    , createdAt  : {type : Date, default : Date.now}
    , updatedAt  : {type : Date, default : Date.now}
})

UserSchema.method('authenticate', function(plainText) {
	console.log('auth....' + plainText + "-" + this.password)
	return plainText == this.password
})

mongoose.model('User', UserSchema)