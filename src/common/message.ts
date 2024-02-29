import httpStatus from 'http-status'
import { IMessage } from './interface'

export const INTERNAL_SERVER_ERROR: IMessage = {
  message: 'Error',
  status: httpStatus.INTERNAL_SERVER_ERROR
}
