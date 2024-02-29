import express from 'express'
import { validateComment } from '~/common/validator'
import commentController from '~/controller/comment.controller'
import { authorizationMember } from '~/middleware/auth'

const commentRouter = express.Router()

commentRouter.use(authorizationMember).route('/:orchidId').post(validateComment, commentController.postComment)

export default commentRouter
