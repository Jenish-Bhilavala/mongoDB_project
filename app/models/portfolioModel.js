const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  project_name: {
    type: String,
    maxLength: 50,
    required: true,
  },
  category_id: {
    type: mongoose.Types.ObjectId(),
    ref: 'category',
  },
});

const portfolioModel = mongoose.model('portfolio', portfolioSchema);
module.exports = portfolioModel;
