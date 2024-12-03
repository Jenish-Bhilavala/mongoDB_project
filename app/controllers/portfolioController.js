const portfolioModel = require('../models/portfolioModel');
const HandleResponse = require('../services/errorHandler');
const message = require('../utils/message');
const { response } = require('../utils/enum');
const { StatusCodes } = require('http-status-codes');
const { logger } = require('../logger/logger');
const {
  portfolioValidation,
  portfolioUpdateValidation,
} = require('../validations/portfolioValidation');

module.exports = {
  addPortfolio: async (req, res) => {
    try {
      const { project_name, category_id, description } = req.body;
      const { error } = portfolioValidation.validate(req.body);

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

      const image = req.files.map((item) => item.filename);
      const newPortfolio = new portfolioModel({
        project_name,
        category_id,
        description,
        image,
      });

      await newPortfolio.save();

      logger.info(`Portfolio ${message.ADDED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.ERROR,
          StatusCodes.CREATED,
          `Portfolio ${message.ADDED_SUCCESS}`,
          {
            id: newPortfolio._id,
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

  viewPortfolio: async (req, res) => {
    try {
      const { id } = req.params;
      let findPortfolio = await portfolioModel
        .findOne({ _id: id, isDelete: false })
        .populate('category_id', 'category_name')
        .select('-isDelete');

      if (!findPortfolio) {
        logger.error(`Portfolio ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `Portfolio ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      logger.info(`Portfolio ${message.GET_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.OK,
          undefined,
          findPortfolio
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

  listPortfolio: async (req, res) => {
    try {
      const { page, limit, sortBy, orderBy, searchTerm } = req.body;
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const pipeline = [];

      if (searchTerm) {
        pipeline.push({
          $match: {
            project_name: { $regex: searchTerm, $options: 'i' },
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

      const findPortfolio = await portfolioModel.aggregate(pipeline);

      if (!findPortfolio) {
        logger.error(`Portfolio ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `Portfolio ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      logger.info(`Portfolio ${message.RETRIEVED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.OK,
          undefined,
          findPortfolio
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

  updatePortfolio: async (req, res) => {
    try {
      const { id } = req.params;
      const { project_name, description, category_id } = req.body;
      const { error } = portfolioUpdateValidation.validate(req.body);

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
      const findPortfolio = await portfolioModel.findOne({
        _id: id,
        isDelete: false,
      });

      if (!findPortfolio) {
        logger.error(`Portfolio ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `Portfolio ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      const imageArray = req.files
        ? req.files.map((item) => item.filename)
        : null;
      const image = imageArray.length > 0 ? imageArray : findPortfolio.image;
      const updatePortfolio = {
        project_name,
        category_id,
        description,
        image,
      };

      await findPortfolio.updateOne(updatePortfolio);
      logger.info(`Portfolio ${message.UPDATED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.ACCEPTED,
          `Portfolio ${message.UPDATED_SUCCESS}`,
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

  deletePortfolio: async (req, res) => {
    try {
      const { id } = req.params;
      const findPortfolio = await portfolioModel
        .findOne({ _id: id, isDelete: false })
        .populate('category_id', 'category_name');

      if (!findPortfolio) {
        logger.error(`Portfolio ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `Portfolio ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      await findPortfolio.updateOne({ isDelete: true });

      logger.info(`Portfolio ${message.DELETED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.OK,
          `Portfolio ${message.DELETED_SUCCESS}`,
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
