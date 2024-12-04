const Joi = require('joi');

const testimonialValidation = Joi.object({
  clint_name: Joi.string().required().messages({
    'string.base': 'Clint name must be a string.',
    'string.empty': 'Clint name cannot be empty.',
    'any.required': 'Clint name is a required field.',
  }),
  review: Joi.string().required().messages({
    'string.base': 'Review must be a string.',
    'string.empty': 'Review cannot be empty.',
    'any.required': 'Review is a required field.',
  }),
  image: Joi.string().optional(),
});

const updateTestimonialValidation = Joi.object({
  clint_name: Joi.string().optional().messages({
    'string.base': 'Clint name must be a string',
    'string.empty': 'Clint name cannot be empty.',
  }),
  review: Joi.string().optional().messages({
    'string.base': 'Clint name must be a string',
    'string.empty': 'Clint name cannot be empty.',
  }),
  image: Joi.string().optional(),
  is_delete: Joi.forbidden().messages({
    'any.unknown': 'is_delete cannot be updated.',
  }),
});

module.exports = {
  testimonialValidation,
  updateTestimonialValidation,
};
