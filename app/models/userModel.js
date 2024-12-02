const mongoose = require('mongoose');
const { gender } = require('../utils/enum');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    hobby: {
      type: String,
      required: false,
      maxlength: 50,
    },
    gender: {
      type: String,
      enum: gender,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      maxlength: 255,
    },
    phone: {
      type: String,
      required: true,
      maxlength: 10,
      minLength: 10,
    },
    image: {
      type: String,
      required: false,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
    collection: 'user',
  }
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
