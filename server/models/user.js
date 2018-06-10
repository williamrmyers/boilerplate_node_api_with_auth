const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  first_name: {
    type:String,
    minlength: 1,
    max: 50
  },
  last_name: {
    type:String,
    minlength: 1,
    max: 50
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
  access: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
}]
});
// Custom User methods defined here with es5 function key words.

// User methods will now only return email, _id, first_name, and last_name.
UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email','first_name', 'last_name']);
};

UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET ).toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  let user = this;
  // The $pull operator removes from an existing array all instances of
  // a value or values that match a specified condition.
  // In this case we are removing the array elements that match the 'token' variable passed into the funtion.
  return user.update({
    $pull: {
      tokens:{
        token: token
      }
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  // Get called with model becuse its a static
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e){
    return Promise.reject();
  }
  return User.findOne({
    "_id": decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

// Will hash every password. runs before save, and works by swaping the plane text
// password with a hashed and salted version before saving.
UserSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

let User = mongoose.model('User', UserSchema);

module.exports = { User };
