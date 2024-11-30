const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/boiler_plate');
    console.log('Database connected successfully.');
  } catch (error) {
    console.log('Database error ', error);
    process.exit(1);
  }
};

module.exports = connectDB;
