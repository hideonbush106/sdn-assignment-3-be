/* eslint-disable no-unsafe-finally */
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import httpStatus from 'http-status'
import { IMessage } from '~/common/interface'
import Comment, { IComment } from '~/schemas/comment.schema'
import Orchid from '~/schemas/orchid.schema'

const commentController = {
  postComment: async (req: Request, res: Response) => {
    const query: string = req.params.orchidId
    let response: IMessage = {
      message: `Created`,
      status: httpStatus.CREATED
    }
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        response.message = 'Validation error'
        response.status = httpStatus.UNPROCESSABLE_ENTITY
        response.data = errors.array()
      } else if (!query) {
        response = {
          message: 'Orchid params is required',
          status: httpStatus.BAD_REQUEST
        }
      } else {
        const isOrchidHasComment = await Orchid.findById(query)
        if (
          isOrchidHasComment?.comments.length === 0 ||
          isOrchidHasComment?.comments.filter((value: IComment) => value.author.toString() === res.locals.id).length ===
            0
        ) {
          const data: IComment = await Comment.create({
            comment: req.body.comment,
            author: res.locals.id
          })
          await Orchid.findByIdAndUpdate(query, {
            $push: { comments: data }
          })
          response.data = data
        } else {
          response = {
            message: 'Comment limited',
            status: httpStatus.BAD_REQUEST
          }
        }
      }
    } catch (error: any) {
      console.log(error)
      if (error.name === 'CastError') {
        response = {
          message: `Invalid ${error.path}: ${error.value}`,
          status: httpStatus.BAD_REQUEST
        }
      }
    } finally {
      return res.status(response.status).json(response)
    }
  }
}

export default commentController
