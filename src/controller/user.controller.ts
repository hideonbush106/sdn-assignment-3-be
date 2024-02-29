/* eslint-disable no-unsafe-finally */
import { Request, Response } from 'express'
import { IMessage } from '~/common/interface'
import User, { IUser } from '~/schemas/user.schema'
import httpStatus from 'http-status'
import { validationResult } from 'express-validator'
import * as bcrypt from 'bcrypt'
import { createSendToken } from './auth.controller'

const userController = {
  getAllUsers: async (req: Request, res: Response) => {
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const data = await User.find(
        {},
        {
          password: 0,
          isAdmin: 0
        }
      )
      response.data = data
    } catch (error) {
      response = {
        message: 'Error',
        status: httpStatus.INTERNAL_SERVER_ERROR
      }
    } finally {
      return res.status(response.status).json(response)
    }
  },

  getUser: async (req: Request, res: Response) => {
    const userId = res.locals.id
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const data = await User.findOne(
        {
          _id: userId
        },
        {
          password: 0,
          isAdmin: 0
        }
      )
      if (!data) {
        response = {
          message: `User not found with id: ${userId}`,
          status: httpStatus.NOT_FOUND
        }
      } else {
        response.data = data
      }
    } catch (error: any) {
      if (error.name === 'CastError') {
        response = {
          message: `Invalid ${error.path}: ${error.value}`,
          status: httpStatus.BAD_REQUEST
        }
      }
    } finally {
      return res.status(response.status).json(response)
    }
  },

  createUser: async (req: Request, res: Response) => {
    const response: IMessage = {
      message: `Created`,
      status: httpStatus.CREATED
    }
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        response.message = 'Validation error'
        response.status = httpStatus.UNPROCESSABLE_ENTITY
        response.data = errors.array()
      } else {
        const userData = {
          ...req.body,
          isAdmin: false
        }
        const data: IUser = await User.create(userData)
        response.data = data
      }
    } catch (error: any) {
      if (error.code === 11000) {
        response.message = `User already existed`
        response.status = httpStatus.BAD_REQUEST
      }
    } finally {
      return res.status(response.status).json(response)
    }
  },

  updateUser: async (req: Request, res: Response) => {
    const userId = res.locals.id
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        response.message = 'Validation error'
        response.status = httpStatus.UNPROCESSABLE_ENTITY
        response.data = errors.array()[1].msg
        return res.status(response.status).json(response)
      } else {
        const data = await User.findByIdAndUpdate(userId, req.body, {
          password: 0,
          isAdmin: 0,
          new: true
        })
        if (!data) {
          response = {
            message: `User not found with id: ${userId}`,
            status: httpStatus.NOT_FOUND
          }
        } else {
          createSendToken(data, 200, res, 'User updated')
        }
      }
    } catch (error: any) {
      if (error.name === 'CastError') {
        response = {
          message: `Invalid ${error.path}: ${error.value}`,
          status: httpStatus.BAD_REQUEST
        }
      }
      return res.status(response.status).json(response)
    }
  },

  changePassword: async (req: Request, res: Response) => {
    const userId = res.locals.id
    const SALT_WORK_FACTOR = 10
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        response.message = 'Validation error'
        response.status = httpStatus.UNPROCESSABLE_ENTITY
        response.data = errors.array()
      } else {
        const user: IUser = await User.findById(userId).select('+password')
        const isPasswordMatch = await user.comparePasswords(req.body.oldPassword)
        if (isPasswordMatch) {
          const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
          const password = await bcrypt.hash(req.body.newPassword, salt)
          const data = await User.findByIdAndUpdate(
            userId,
            { password: password },
            {
              password: 0,
              isAdmin: 0,
              new: true
            }
          )
          if (!data) {
            response = {
              message: `User not found with id: ${userId}`,
              status: httpStatus.NOT_FOUND
            }
          } else {
            response.data = data
          }
        } else {
          response = {
            message: `Password not match`,
            status: httpStatus.BAD_REQUEST
          }
        }
      }
    } catch (error: any) {
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

export default userController
