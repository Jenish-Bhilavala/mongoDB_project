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
        logger.error(`Category ${message.ALREADY_EXIST}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.BAD_REQUEST,
            `Category ${message.ALREADY_EXIST}`,
            undefined
          )
        );
      }

      const newCategory = new categoryModel({
        category_name,
      });
      const addCategory = await newCategory.save();

      logger.info(`Category ${message.ADDED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.CREATED,
          `Category ${message.ADDED_SUCCESS}`,
          undefined,
          {
            id: addCategory._id,
          }
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

  viewCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const findCategory = await categoryModel.findById(id);

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

      logger.info(`Category ${message.GET_SUCCESS}`);
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
      const { page, limit, sortBy, orderBy, searchTerm } = req.body;
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const pipeline = [];

      if (searchTerm) {
        pipeline.push({
          $match: {
            category_name: { $regex: searchTerm, $options: 'i' },
          },
        });
      }

      const sortOrder = orderBy === 'asc' ? 1 : -1;

      pipeline.push({
        $sort: { [sortBy]: sortOrder },
      });

      pipeline.push(
        { $skip: (pageNumber - 1) * limitNumber },
        { $limit: limitNumber }
      );

      const findCategory = await categoryModel.aggregate(pipeline);

      if (findCategory.length === 0) {
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
        HandleResponse(response.SUCCESS, StatusCodes.OK, undefined, {
          findCategory,
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

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
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

      const findCategory = await categoryModel.findById(id);

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

      await categoryModel.updateOne(req.body);

      logger.info(`Category ${message.UPDATED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.ACCEPTED,
          `Category ${message.UPDATED_SUCCESS}`,
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

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const findCategory = await categoryModel.findById(id);

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

      await categoryModel.deleteOne(findCategory);

      logger.info(`Category ${message.DELETED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.OK,
          `Category ${message.DELETED_SUCCESS}`,
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
};
