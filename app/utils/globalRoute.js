const express = require('express');
const router = express.Router();
const { response } = require('./enum');
const message = require('./message');
const HandleResponse = require('../services/errorHandler');
const { StatusCodes } = require('http-status-codes');

module.exports = {
  globalRoute: (req, res) => {
    return res.json(
      HandleResponse(
        response.ERROR,
        StatusCodes.METHOD_NOT_ALLOWED,
        message.METHOD_NOT_ALLOWED,
        undefined
      )
    );
  },
};
