/* eslint-disable no-unsafe-finally */
import { CookieOptions, NextFunction, Request, Response } from 'express'
import User, { IUser } from '~/schemas/user.schema'
import dotenv from 'dotenv'
import { IMessage } from '~/common/interface'
import httpStatus from 'http-status'
import { validationResult } from 'express-validator'
import * as jwt from 'jsonwebtoken'

dotenv.config()
const jwtSecretKey = process.env.JWT_SECRET_KEY

export const signToken = (data: IUser) => {
  return jwt.sign({ id: data._id, username: data.username, isAdmin: data.isAdmin }, jwtSecretKey || '', {
    expiresIn: '30d'
  })
}

export const createSendToken = (user: IUser, statusCode: number, res: Response, message: string) => {
  const token = signToken(user)
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  const response: IMessage = {
    message: message,
    status: statusCode,
    data: token
  }
  return res.cookie('jwt', token, cookieOptions).status(statusCode).json(response)
}

const authController = {
  register: async (req: Request, res: Response) => {
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
        createSendToken(data, httpStatus.CREATED, res, 'User registered successfully')
      }
    } catch (error: any) {
      if (error.code === 11000) {
        response.message = `User already existed`
        response.status = httpStatus.BAD_REQUEST
        return res.status(response.status).json(response)
      }
    }
  },

  login: async (req: Request, res: Response) => {
    let response: IMessage = {
      message: `Created`,
      status: httpStatus.CREATED
    }
    try {
      const { username, password } = req.body
      if (!username || !password) {
        response = {
          message: 'Email or password required',
          status: httpStatus.BAD_REQUEST
        }
        return res.status(response.status).json(response)
      }

      const user: IUser = await User.findOne({ username }).select('+password')

      if (!user || !(await user.comparePasswords(password))) {
        response = {
          message: 'Invalid credential',
          status: httpStatus.UNAUTHORIZED
        }
        return res.status(response.status).json(response)
      }
      createSendToken(user, httpStatus.OK, res, 'Login successfully')
    } catch (error) {
      console.log(error)
    }
  }
}

export default authController
