const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    project_name: {
      type: String,
      maxLength: 50,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    description: {
      type: String,
      maxLength: 255,
      required: true,
    },
    image: {
      type: Array,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'portfolio',
  }
);

const portfolioModel = mongoose.model('portfolio', portfolioSchema);
module.exports = portfolioModel;
