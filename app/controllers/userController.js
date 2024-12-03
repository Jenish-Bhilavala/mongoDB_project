const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const HandleResponse = require('../services/errorHandler');
const message = require('../utils/message');
const { StatusCodes } = require('http-status-codes');
const { response } = require('../utils/enum');
const { logger } = require('../logger/logger');
const { sendMail, generateOTP } = require('../services/email');
const {
  registerValidation,
  loginValidation,
  updateUserValidation,
  verifyEmailValidation,
  forgotPasswordValidation,
} = require('../validations/userValidation');
require('dotenv').config();

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

      const findUser = await userModel.findById(id).select('-password');

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

      const findUser = await userModel.findOne({ email });

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

      const isPasswordMatch = await bcrypt.compare(password, findUser.password);

      if (!isPasswordMatch) {
        logger.error(message.INVALID_PASSWORD);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.BAD_REQUEST,
            message.INVALID_PASSWORD,
            undefined
          )
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

      logger.info(message.LOGIN_SUCCESS);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.OK,
          message.LOGIN_SUCCESS,
          { token }
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

  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = updateUserValidation.validate(req.body);

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

      const findUser = await userModel.findById(id);

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

      const imageValue = req.file ? req.file.filename : findUser.image;
      const updateUser = req.body;
      await userModel.updateOne(
        { _id: findUser._id },
        {
          $set: {
            ...updateUser,
            image: imageValue,
          },
        }
      );

      logger.info(`Profile ${message.UPDATED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.ACCEPTED,
          `Profile ${message.UPDATED_SUCCESS}`
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

  verifyEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const { error } = verifyEmailValidation.validate(req.body);

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

      const findUser = await userModel.findOne({ email });

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

      const otp = generateOTP();
      const expire_at = moment().add(5, 'minutes').format();
      const otpData = new otpModel({
        email,
        otp,
        expire_at,
      });

      await otpData.save();
      await sendMail(email, otp);

      logger.info(message.OTP_SENT);
      return res.json(
        HandleResponse(response.SUCCESS, StatusCodes.OK, message.OTP_SENT, {
          otp,
        })
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

  forgotPassword: async (req, res) => {
    try {
      const { email, newPassword, confirmPassword, otp } = req.body;
      const { error } = forgotPasswordValidation.validate(req.body);
      const findOTP = await otpModel.findOne({ otp });

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

      if (!findOTP) {
        logger.error(`OTP ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `OTP ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const findUser = await userModel.findOne({ email });

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

      await otpModel.deleteOne({ otp });
      await userModel.updateOne(
        { email: findUser.email },
        { $set: { password: hashedPassword } }
      );

      logger.info(`Password ${message.UPDATED}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.ACCEPTED,
          `Profile ${message.UPDATED_SUCCESS}`
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
};
