/* eslint-disable no-unsafe-finally */
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import slugify from 'slugify'
import { IMessage } from '~/common/interface'
import Orchid from '~/schemas/orchid.schema'

const publicController = {
  getAllOrchids: async (req: Request, res: Response) => {
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const data = await Orchid.find(
        {},
        {
          name: 1,
          image: 1,
          category: 1,
          slug: 1
        }
      ).populate({
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
    const query = req.params.orchidSlug
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      const data = await Orchid.findOne(
        {
          slug: query
        },
        {
          createdAt: 0,
          updatedAt: 0
        }
      )
        .populate({
          path: 'category',
          select: 'name'
        })
        .populate({
          path: 'comments.author',
          select: 'username'
        })
      if (!data) {
        response = {
          message: `Orchid not found: ${query}`,
          status: httpStatus.NOT_FOUND
        }
      } else {
        response.data = data
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
  },

  searchOrchid: async (req: Request, res: Response) => {
    let query: string = req.query.q as string
    let response: IMessage = {
      message: 'Success',
      status: httpStatus.OK
    }
    try {
      if (!query) {
        response = {
          message: 'Search params is required',
          status: httpStatus.BAD_REQUEST
        }
      } else {
        query = slugify(query)
        const data = await Orchid.find(
          {
            slug: {
              $regex: query
            }
          },
          {
            name: 1,
            image: 1,
            category: 1
          }
        ).populate({
          path: 'category',
          select: 'name'
        })
        if (!data) {
          response = {
            message: `Orchid not found: ${query}`,
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
    } finally {
      return res.status(response.status).json(response)
    }
  }
}

export default publicController
