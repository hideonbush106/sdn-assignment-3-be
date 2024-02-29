import mongoose, { Document, Schema, Types, model } from 'mongoose'
import { IComment, CommentSchema } from './comment.schema'

export interface IOrchid extends Document {
  name: string
  image: string
  isNatural: boolean
  origin: string
  slug: string
  comments: IComment[]
  category: Types.ObjectId
}

export const OrchidSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      index: {
        unique: true
      }
    },
    image: { type: String, require: true },
    isNatural: { type: Boolean, default: false },
    slug: { type: String, require: true },
    origin: { type: String, require: true },
    comments: [CommentSchema],
    category: { type: Schema.Types.ObjectId, ref: 'Categories', require: true }
  },
  {
    timestamps: true,
    collection: 'orchids',
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
      }
    }
  }
)

const Orchid = model<IOrchid>('Orchids', OrchidSchema)

export default Orchid
