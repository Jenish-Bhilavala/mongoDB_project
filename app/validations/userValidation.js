const Joi = require('joi');
const { gender } = require('../utils/enum');

const registerValidation = Joi.object({
  firstName: Joi.string().required().messages({
    'string.base': 'First name must be a string.',
    'string.empty': 'First name cannot be empty.',
    'any.required': 'First name is a required field.',
  }),
  lastName: Joi.string().required().messages({
    'string.base': 'Last name must be a string.',
    'string.empty': 'Last name cannot be empty.',
    'any.required': 'Last name is a required field.',
  }),
  hobby: Joi.string().required().messages({
    'string.base': 'Hobby must be a string.',
    'string.empty': 'Hobby cannot be empty.',
    'any.required': 'Hobby is a required field',
  }),
  gender: Joi.string()
    .valid(gender.MALE, gender.FEMALE, gender.OTHER)
    .required()
    .messages({
      'string.base': 'Gender must be a string.',
      'string.empty': 'Gender cannot be empty.',
      'any.required': 'Gender is a required field.',
      'any.only': 'Gender must be male, female, or other.',
    }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email cannot be empty.',
    'any.required': 'Email is a required field.',
    'string.email': 'Email must be a valid email address.',
  }),
  password: Joi.string()
    .pattern(new RegExp('^[A-Z][a-zA-Z0-9!@#$%&*.]{7,}$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must start with a capital latter and must be at least 8 characters long.',
      'string.empty': 'Password cannot be empty.',
      'any.required': 'Password must be required.',
    }),
  phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required().messages({
    'string.pattern.base': 'Phone must be exactly 10 digits.',
    'string.empty': 'Phone cannot be empty.',
    'any.required': 'Phone is a required field.',
  }),
  image: Joi.string().optional(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email cannot be empty.',
    'any.required': 'Email is a required field.',
    'string.email': 'Email must be a valid email address.',
  }),
  password: Joi.string()
    .pattern(new RegExp('^[A-Z][a-zA-Z0-9!@#$%&*.]{7,}$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must start with capital latter and must be at least 8 character long.',
      'string.empty': 'Password cannot be empty.',
      'any.required': 'Password is a required field.',
    }),
});

const updateUserValidation = Joi.object({
  firstName: Joi.string().optional().messages({
    'string.base': 'First name must be a string.',
    'string.empty': 'First name cannot be empty.',
  }),
  lastName: Joi.string().optional().messages({
    'string.base': 'Last name must be a string.',
    'string.empty': 'Last name cannot be empty.',
  }),
  hobby: Joi.string().optional().messages({
    'string.base': 'Hobby must be a string.',
    'string.empty': 'Hobby cannot be empty.',
  }),
  gender: Joi.string()
    .valid(gender.MALE, gender.FEMALE, gender.OTHER)
    .optional()
    .messages({
      'string.base': 'Gender must be a string.',
      'string.empty': 'Gender cannot be empty.',
      'any.only': 'Gender must be male, female, or other.',
    }),
  email: Joi.string().email().optional().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email cannot be empty.',
    'string.email': 'Email must be a valid email address.',
  }),
  password: Joi.forbidden().messages({
    'any.unknown': 'Password cannot be updated.',
  }),
  phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).optional().messages({
    'string.pattern.base': 'Phone must be exactly 10 digits.',
    'string.empty': 'Phone cannot be empty.',
  }),
  image: Joi.string().optional(),
});

const verifyEmailValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email cannot be empty.',
    'any.required': 'Email is a required field.',
    'string.email': 'Email must be a valid email address.',
  }),
});

const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email cannot be empty.',
    'any.required': 'Email is a required field.',
    'string.email': 'Email must be a valid email address.',
  }),
  newPassword: Joi.string()
    .pattern(new RegExp('^[A-Z][a-zA-Z0-9!@#$%&*.]{7,}$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must start with a capital latter and must be at least 8 characters long.',
      'string.empty': 'Password cannot be empty.',
      'any.required': 'Password must be required.',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'New password and confirm password must be same.',
      'string.empty': 'Confirm password cannot be empty.',
      'any.required': 'Confirm password must be required.',
    }),
});

module.exports = {
  registerValidation,
  loginValidation,
  updateUserValidation,
  verifyEmailValidation,
  forgotPasswordValidation,
};
