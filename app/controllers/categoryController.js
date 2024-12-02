const { ObjectId } = require('mongodb');
const categoryModel = require('../models/categoryModel');
const HandleResponse = require('../services/errorHandler');
const message = require('../utils/message');
const { StatusCodes } = require('http-status-codes');
const { response } = require('../utils/enum');
const { logger } = require('../logger/logger');
const { categoryValidation } = require('../validations/categoryValidation');

module.exports = {
  addCategory: async (req, res) => {
    try {
      const { category_name } = req.body;
      const { error } = categoryValidation.validate(req.body);

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

      existingCategory = await categoryModel.findOne({ category_name });

      if (existingCategory) {
        logger.error('Category already exist.');
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.BAD_REQUEST,
            'Category already exist.',
            undefined
          )
        );
      }

      const newCategory = new categoryModel({
        category_name,
      });
      const addCategory = await newCategory.save();

      logger.info('Category added.');
      return res.json(
        HandleResponse(response.SUCCESS, StatusCodes.CREATED, undefined, {
          id: addCategory._id,
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

  viewCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const findCategory = await categoryModel.findOne({
        _id: new ObjectId(id),
      });

      if (!findCategory) {
        logger.error(`Category ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `Category ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      logger.info(`Category ${message.RETRIEVED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.OK,
          undefined,
          findCategory
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

  listCategory: async (req, res) => {
    try {
      const { id } = req.params;
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
