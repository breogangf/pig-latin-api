const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

//authenticate input against database
userSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({ email }, (errorRetrivingUser, user) => {
    if (errorRetrivingUser) {
      return callback(errorRetrivingUser);
    } else if (!user) {
      const err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, (errorComparingPasswords, result) => {
      if (result === true) {
        return callback(null, user);
      }
      return callback();
    });
  });
};

module.exports = mongoose.model('User', userSchema, 'Users');
