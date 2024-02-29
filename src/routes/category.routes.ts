import express from 'express'
import { authorizationAdmin } from '~/middleware/auth'
import { validateCategory } from '~/common/validator'
import categoryController from '~/controller/category.controller'

const categoryRouter = express.Router()
categoryRouter
  .use(authorizationAdmin)
  .route('/')
  .get(categoryController.getAllCategories)
  .post(validateCategory, categoryController.createCategory)
categoryRouter
  .use(authorizationAdmin)
  .route('/:categoryId')
  .get(categoryController.getCategory)
  .put(validateCategory, categoryController.updateCategory)
  .delete(categoryController.deleteCategory)

export default categoryRouter
