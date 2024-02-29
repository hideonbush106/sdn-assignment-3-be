import { Document, Schema, model } from 'mongoose'
import { Status } from '~/utils'

export interface ICategory extends Document {
  name: string
}

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      index: {
        unique: true
      }
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'DELETED'],
      default: 'ACTIVE'
    }
  },
  {
    timestamps: true,
    collection: 'categories',
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
      }
    }
  }
)

const Category = model<ICategory>('Categories', CategorySchema)

export default Category
