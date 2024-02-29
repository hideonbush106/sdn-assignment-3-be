import passport from 'passport'
import * as jwt from 'passport-jwt'
import User, { IUser } from '~/schemas/user.schema'
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { jwtDecode } from 'jwt-decode'
import httpStatus from 'http-status'

dotenv.config()
const jwtSecretKey = process.env.JWT_SECRET_KEY

const jwtOptions: jwt.StrategyOptionsWithoutRequest = {
  jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecretKey || ''
}

export const authorizationAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if (!token) return res.send('Unauthorized')
  let payload = {
    id: '',
    username: '',
    isAdmin: true,
    iat: 0,
    exp: 0
  }
  payload = jwtDecode(token)
  if (payload.isAdmin) {
    res.locals = payload
    next()
  } else
    return res.status(httpStatus.FORBIDDEN).json({
      message: 'Not allowed',
      status: httpStatus.FORBIDDEN
    })
}

export const authorizationMember = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if (!token) return res.send('Unauthorized')
  let payload = {
    id: '',
    username: '',
    isAdmin: true,
    iat: 0,
    exp: 0
  }
  payload = jwtDecode(token)
  if (!payload.isAdmin) {
    res.locals = payload
    next()
  } else
    return res.status(httpStatus.FORBIDDEN).json({
      message: 'Not allowed',
      status: httpStatus.FORBIDDEN
    })
}

passport.use(
  new jwt.Strategy(jwtOptions, (payload, done) => {
    User.findOne({ _id: payload.id })
      .then((user: IUser | null) => {
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
      .catch((error: any) => {
        return done(error, false)
      })
  })
)
