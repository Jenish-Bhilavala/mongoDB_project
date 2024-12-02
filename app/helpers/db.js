const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log('Database connected successfully.');
  } catch (error) {
    console.log('Database error ', error);
    process.exit(1);
  }
};

module.exports = connectDB;
