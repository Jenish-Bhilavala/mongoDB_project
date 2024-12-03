const Joi = require('joi');

const portfolioValidation = Joi.object({
  project_name: Joi.string().required().messages({
    'string.base': 'Project name must be a string.',
    'string.empty': 'Project name cannot be empty.',
    'any.required': 'Project name is a required field.',
  }),
  category_id: Joi.string().required().messages({
    'string.base': 'Category_id must be a string.',
    'string.empty': 'Category_id cannot be empty.',
    'any.required': 'Category_id is a required field.',
  }),
  description: Joi.string().required().messages({
    'string.base': 'Description must be a string.',
    'string.empty': 'Description cannot be empty.',
    'any.required': 'Description is a required field.',
  }),
  image: Joi.string().optional(),
});

const portfolioUpdateValidation = Joi.object({
  project_name: Joi.string().optional().messages({
    'string.base': 'Project name must be a string.',
    'string.empty': 'Project name cannot be empty.',
  }),
  category_id: Joi.string().optional().messages({
    'string.base': 'Category_id must be a string.',
    'string.empty': 'Category_id cannot be empty.',
  }),
  description: Joi.string().optional().messages({
    'string.base': 'Description must be a string.',
    'string.empty': 'Description cannot be empty.',
  }),
  image: Joi.string().optional(),
});

module.exports = { portfolioValidation, portfolioUpdateValidation };
