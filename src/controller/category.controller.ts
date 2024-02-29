/* eslint-disable no-unsafe-finally */
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import httpStatus from 'http-status'
import { IMessage } from '~/common/interface'
import Category, { ICategory } from '~/schemas/category.schema'
import { Status } from '~/utils'

const categoryController = {
  getAllCategories: async (req: Request, res: Response) => {
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const data = await Category.find(
        {
          status: {
            $ne: Status.DELETED
          }
        },
        {
          status: 0
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

  getCategory: async (req: Request, res: Response) => {
    const query = req.params.categoryId
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const data = await Category.findOne({
        _id: query
      })
      if (!data) {
        response = {
          message: `Category not found with id: ${query}`,
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

  createCategory: async (req: Request, res: Response) => {
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
        const data: ICategory = await Category.create(req.body)
        response.data = data
      }
    } catch (error: any) {
      if (error.code === 11000) {
        response.message = `Category already existed`
        response.status = httpStatus.BAD_REQUEST
      }
    } finally {
      return res.status(response.status).json(response)
    }
  },

  updateCategory: async (req: Request, res: Response) => {
    const query = req.params.categoryId
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
        const data = await Category.findOneAndUpdate(
          {
            _id: query
          },
          req.body,
          { new: true }
        )
        if (!data) {
          response = {
            message: `Category not found with id: ${query}`,
            status: httpStatus.NOT_FOUND
          }
        } else {
          response.data = data
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
        response.message = `Category already existed`
        response.status = httpStatus.BAD_REQUEST
      }
    } finally {
      return res.status(response.status).json(response)
    }
  },

  deleteCategory: async (req: Request, res: Response) => {
    const query = req.params.categoryId
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const data = await Category.findOneAndUpdate(
        {
          _id: query
        },
        {
          status: Status.DELETED
        }
      )
      if (!data) {
        response = {
          message: `Category not found with id: ${query}`,
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

export default categoryController
