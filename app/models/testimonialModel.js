const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clint_name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    review: {
      type: String,
      required: true,
      maxlength: 255,
    },
    image: {
      type: String,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'testimonial',
  }
);

const testimonialModel = mongoose.model('testimonial', testimonialSchema);
module.exports = testimonialModel;
