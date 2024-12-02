const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/userModel');
const HandleResponse = require('../services/errorHandler');
const message = require('../utils/message');
const { StatusCodes } = require('http-status-codes');
const { response } = require('../utils/enum');
const { logger } = require('../logger/logger');
const {
  registerValidation,
  loginValidation,
  updateUserValidation,
} = require('../validations/userValidation');
const { ObjectId } = require('mongodb');
require('dotenv').config();

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { firstName, lastName, hobby, gender, email, password, phone } =
        req.body;
      const image = req.file ? path.join(req.file.filename) : null;
      console.log(req.file);

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

      const existingUser = await User.findOne({ email });

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

      const newUser = new User({
        firstName,
        lastName,
        hobby,
        gender,
        email,
        password: hashedPassword,
        phone,
        image,
      });

      const user = await newUser.save();

      logger.info(message.USER_REGISTERED);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.CREATED,
          message.USER_REGISTERED,
          { _id: user.id },
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

  viewUser: async (req, res) => {
    try {
      const { id } = req.params;
      const findUser = await User.findOne({ _id: new ObjectId(id) }).select(
        '-password'
      );

      if (!findUser) {
        logger.error(`User ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(response.ERROR, StatusCodes.NOT_FOUND, undefined)
        );
      }

      logger.info(`User ${message.RETRIEVED_SUCCESS}`);
      return res.json(
        HandleResponse(response.SUCCESS, StatusCodes.OK, findUser)
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

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const { error } = loginValidation.validate(req.body);

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

      const findUser = await User.findOne({ email });

      if (!findUser) {
        logger.error(`User ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(response.ERROR, StatusCodes.NOT_FOUND, undefined)
        );
      }

      const isPasswordMatch = await bcrypt.compare(password, findUser.password);

      if (!isPasswordMatch) {
        logger.error(message.INVALID_PASSWORD);
        return res.json(
          HandleResponse(response.ERROR, StatusCodes.BAD_REQUEST, undefined)
        );
      }

      const token = jwt.sign(
        {
          _id: findUser._id,
          email: findUser.email,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE_IN }
      );

      logger.info('User login successfully.');
      return res.json(
        HandleResponse(response.SUCCESS, StatusCodes.OK, undefined, { token })
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

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, hobby, gender, email, phone } = req.body;
      const { error } = updateUserValidation.validate(req.body);
      console.log(req.body);

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

      const findUser = await User.findOne({ _id: new ObjectId(id) });

      if (!findUser) {
        logger.error(`User ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `User ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      const image = req.file ? path.join(req.file.filename) : findUser.image;
      const updateUser = {
        firstName,
        lastName,
        hobby,
        gender,
        email,
        phone,
        image,
      };
      await findUser.updateOne(
        { _id: findUser._id },
        { $set: { ...updateUser } }
      );

      logger.info(`User ${message.UPDATED}`);
      return res.json(
        HandleResponse(response.SUCCESS, StatusCodes.ACCEPTED, undefined)
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
