/* eslint-disable no-unsafe-finally */
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import httpStatus from 'http-status'
import slugify from 'slugify'
import { IMessage } from '~/common/interface'
import Category from '~/schemas/category.schema'
import Orchid, { IOrchid } from '~/schemas/orchid.schema'
import { makeid } from '~/utils'

const orchidController = {
  getAllOrchids: async (req: Request, res: Response) => {
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const data = await Orchid.find({}).populate({
        path: 'category',
        select: 'name'
      })
      response.data = data
    } catch (error) {
      console.log(error)
      response = {
        message: 'Error',
        status: httpStatus.INTERNAL_SERVER_ERROR
      }
    } finally {
      return res.status(response.status).json(response)
    }
  },

  getOrchid: async (req: Request, res: Response) => {
    const query = req.params.orchidId
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const data = await Orchid.findOne({
        _id: query
      }).populate({
        path: 'category',
        select: 'name'
      })
      if (!data) {
        response = {
          message: `Orchid not found with id: ${query}`,
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

  createOrchid: async (req: Request, res: Response) => {
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
      } else {
        let orchid: IOrchid = req.body
        const category = await Category.findById(orchid.category)
        if (!category) {
          response = {
            message: `Category not found with id: ${orchid.category}`,
            status: httpStatus.NOT_FOUND
          }
        } else {
          orchid = {
            ...req.body,
            slug: `${slugify(orchid.name, {
              lower: true
            })}-${makeid(5)}`
          }
          const data: IOrchid = await Orchid.create(orchid)
          response.data = data
        }
      }
    } catch (error: any) {
      if (error.code === 11000) {
        response.message = `Orchid already existed`
        response.status = httpStatus.BAD_REQUEST
      }
    } finally {
      return res.status(response.status).json(response)
    }
  },

  updateOrchid: async (req: Request, res: Response) => {
    const query = req.params.orchidId
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
        let orchid: IOrchid = req.body
        const category = await Category.findById(orchid.category)
        if (!category) {
          response = {
            message: `Category not found with id: ${orchid.category}`,
            status: httpStatus.NOT_FOUND
          }
        } else {
          const currentOrchid = await Orchid.findOne({
            _id: query
          })
          if (orchid.name !== currentOrchid?.name) {
            orchid = {
              ...req.body,
              slug: `${slugify(orchid.name, {
                lower: true
              })}-${makeid(5)}`
            }
          }
          const data = await Orchid.findOneAndUpdate(
            {
              _id: query
            },
            orchid,
            { new: true }
          ).populate({
            path: 'category',
            select: 'name'
          })
          if (!data) {
            response = {
              message: `Orchid not found with id: ${query}`,
              status: httpStatus.NOT_FOUND
            }
          } else {
            response.data = data
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
      if (error.code === 11000) {
        response.message = `Orchid already existed`
        response.status = httpStatus.BAD_REQUEST
      }
    } finally {
      return res.status(response.status).json(response)
    }
  },

  deleteOrchid: async (req: Request, res: Response) => {
    const query = req.params.orchidId
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const data = await Orchid.findOneAndDelete({
        _id: query
      }).populate({
        path: 'category',
        select: 'name'
      })
      if (!data) {
        response = {
          message: `Orchid not found with id: ${query}`,
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
  }
}

export default orchidController
