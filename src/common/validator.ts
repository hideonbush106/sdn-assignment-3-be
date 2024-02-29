import { body } from 'express-validator'

export const validateUser = [
  body('username')
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 to 20 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
]

export const validateCategory = [body('name').notEmpty().withMessage('Category name is required.')]

export const validateOrchid = [
  body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 3, max: 200 })
    .withMessage('Name must be between 3 to 200 characters long.'),
  body('image').notEmpty().withMessage('Image is required.').isURL().withMessage('Image must be a URL'),
  body('isNatural').notEmpty().withMessage('isNatural is required.').isBoolean().withMessage('Image must be a boolean'),
  body('origin')
    .notEmpty()
    .withMessage('Origin is required.')
    .isLength({ min: 3, max: 20 })
    .withMessage('Origin must be between 3 to 20 characters long.'),
  body('category')
    .notEmpty()
    .withMessage('Category is required.')
    .isMongoId()
    .withMessage('Category must be a Mongo id.')
]

export const validateComment = [
  body('comment')
    .notEmpty()
    .withMessage('Comment is required.')
    .isLength({ max: 200 })
    .withMessage('Name must less than 200 characters long.')
]

export const validateUpdateUser = [
  body('username')
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 to 20 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores.')
]

export const validateChangePassword = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long.'),
  body('newPassword')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long.')
]
