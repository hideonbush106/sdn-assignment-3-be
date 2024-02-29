import express from 'express'
import { validateUser } from '~/common/validator'
import userController from '~/controller/user.controller'
import { authorizationAdmin } from '~/middleware/auth'

const userRouter = express.Router()
userRouter.route('/me').get(userController.getUser)
userRouter
  .use(authorizationAdmin)
  .route('/')
  .get(userController.getAllUsers)
  .post(validateUser, userController.createUser)

export default userRouter
