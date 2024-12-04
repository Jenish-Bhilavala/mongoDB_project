const testimonialModel = require('../models/testimonialModel');
const message = require('../utils/message');
const HandleResponse = require('../services/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { response } = require('../utils/enum');
const { logger } = require('../logger/logger');
const {
  testimonialValidation,
  updateTestimonialValidation,
} = require('../validations/testimonialValidation');

module.exports = {
  addTestimonial: async (req, res) => {
    try {
      const { clint_name, review } = req.body;
      const { error } = testimonialValidation.validate(req.body);

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

      const image = req.file ? req.file.filename : null;
      const newTestimonial = new testimonialModel({
        clint_name,
        review,
        image,
      });

      await newTestimonial.save();

      logger.info(`Testimonial ${message.ADDED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.CREATED,
          `Testimonial ${message.ADDED_SUCCESS}`,
          { id: newTestimonial._id }
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

  viewTestimonial: async (req, res) => {
    try {
      const { id } = req.params;
      findTestimonial = await testimonialModel
        .findOne({
          _id: id,
          is_delete: false,
        })
        .select('-is_delete');

      if (!findTestimonial) {
        logger.error(`Testimonial ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.BAD_REQUEST,
            `Testimonial ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      logger.info(`Testimonial ${message.GET_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.OK,
          undefined,
          findTestimonial
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

  listOfTestimonial: async (req, res) => {
    try {
      const { page, limit, sortBy, orderBy, searchTerm } = req.body;
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const pipeline = [];

      pipeline.push({
        $match: { is_delete: false },
      });

      pipeline.push({
        $project: {
          is_delete: false,
        },
      });

      if (searchTerm) {
        pipeline.push({
          $match: {
            clint_name: { $regex: searchTerm, $options: 'i' },
          },
        });
      }

      const sortOrder = orderBy === 'ASC' ? 1 : -1;

      pipeline.push({
        $sort: { [sortBy]: sortOrder },
      });

      pipeline.push(
        { $skip: (pageNumber - 1) * limitNumber },
        { $limit: limitNumber }
      );

      const findTestimonial = await testimonialModel.aggregate(pipeline);

      if (findTestimonial.length === 0) {
        logger.error(`Testimonial ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `Testimonial ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      logger.info(`Testimonial ${message.RETRIEVED_SUCCESS}`);
      return res.json(
        HandleResponse(response.SUCCESS, StatusCodes.OK, undefined, {
          findTestimonial,
        })
      );
    } catch (error) {
      logger.error(error.message);
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

  updateTestimonial: async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = updateTestimonialValidation.validate(req.body);

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

      const findTestimonial = await testimonialModel.findOne({
        _id: id,
        is_delete: false,
      });

      if (!findTestimonial) {
        logger.error(`Testimonial ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `Testimonial ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      const image = req.file ? req.file.filename : findTestimonial.image;
      const updateTestimonial = req.body;

      await findTestimonial.updateOne({ ...updateTestimonial, image });

      logger.info(`Testimonial ${message.UPDATED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.ACCEPTED,
          `Testimonial ${message.UPDATED_SUCCESS}`,
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

  deleteTestimonial: async (req, res) => {
    try {
      const { id } = req.params;
      const findTestimonial = await testimonialModel.findOne({
        _id: id,
        is_delete: false,
      });

      if (!findTestimonial) {
        logger.error(`Testimonial ${message.NOT_FOUND}`);
        return res.json(
          HandleResponse(
            response.ERROR,
            StatusCodes.NOT_FOUND,
            `Testimonial ${message.NOT_FOUND}`,
            undefined
          )
        );
      }

      await findTestimonial.updateOne({ is_delete: true });

      logger.info(`Testimonial ${message.DELETED_SUCCESS}`);
      return res.json(
        HandleResponse(
          response.SUCCESS,
          StatusCodes.OK,
          `Testimonial ${message.DELETED_SUCCESS}`,
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
