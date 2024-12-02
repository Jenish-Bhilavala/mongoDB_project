const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const HandleResponse = require('../services/errorHandler');
const message = require('../utils/message');
const { StatusCodes } = require('http-status-codes');
const { response } = require('../utils/enum');
const { logger } = require('../logger/logger');
const { registerValidation } = require('../validations/userValidation');
const { ObjectId } = require('mongodb');

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { firstName, lastName, hobby, gender, email, password, phone } =
        req.body;
      const image = req.file ? req.file.filename : null;
      const { error } = registerValidation.validate(req.body);

      if (error) {
        logger.error(error.details[0].message);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.BAD_REQUEST,
            error.details[0].message,
            undefined
          )
        );
      }

      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        logger.error(`User ${message.ALREADY_EXIST}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.BAD_REQUEST,
            `User ${message.ALREADY_EXIST}`,
            undefined
          )
        );
      }

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);

      const newUser = new userModel({
        firstName,
        lastName,
        hobby,
        gender,
        email,
        password: hashedPassword,
        phone,
        image,
      });

      const userCreate = await newUser.save();

      logger.info(message.USER_REGISTERED);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.CREATED,
          message.USER_REGISTERED,
          { id: userCreate.id },
          undefined
        )
      );
    } catch (error) {
      logger.error(error.message || error);
      return res.json(
        HandleResponse(
          response.ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR,
          error.message || error,
          undefined
        )
      );
    }
  },

  viewProfile: async (req, res) => {
    try {
      const { id } = req.params;

      const findUser = await userModel
        .findOne({ _id: new ObjectId(id) })
        .select('-password');

      if (!findUser) {
        logger.error(`User ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `User ${message.NOT_FOUND}`
          )
        );
      }

      logger.info(`User profile ${message.GET_SUCCESS}`);
      return res.json(
        HandleResponse(response.SUCCESS, StatusCodes.OK, undefined, findUser)
      );
    } catch (error) {
      logger.error(error.message || error);
      return res.json(
        HandleResponse(
          response.ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR,
          error.message || error,
          undefined
        )
      );
    }
  },
};
