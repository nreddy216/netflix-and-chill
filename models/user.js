var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  access_token: String,
  firstName: String,
  lastName: String,
  gender: String,
  birthday: String,
  sexualPref: String,
  email: String,
  facebookID: String,
  status: String,
  location: String,
  profilePic: String,
  password_digest: String,
  movies: []
});


var User = mongoose.model('User', UserSchema);

module.exports = User;
