const mongoose = require('mongoose');
const moment = require('moment');

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      maxlength: 50,
    },
    otp: {
      type: Number,
      required: true,
      maxlength: 6,
    },
    created_at: {
      type: Date,
      required: true,
      default: () => moment().format(),
    },
    expire_at: {
      type: Date,
      required: true,
      default: () => moment().add(5, 'minutes').format(),
    },
  },
  {
    collection: 'otp',
  }
);

otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = mongoose.model('otp', otpSchema);
module.exports = otpModel;
