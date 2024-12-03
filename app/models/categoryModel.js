const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'category',
  }
);

const categoryModel = mongoose.model('category', categorySchema);
module.exports = categoryModel;
