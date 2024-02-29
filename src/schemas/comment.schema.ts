import mongoose, { Document, Schema, Types, model } from 'mongoose'

export interface IComment extends Document {
  rating?: number
  comment: string
  author: Types.ObjectId
}

export const CommentSchema = new Schema(
  {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, require: true },
    author: { type: Schema.Types.ObjectId, ref: 'Users', require: true }
  },
  {
    timestamps: true,
    collection: 'comments',
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
      }
    }
  }
)

const Comment = model<IComment>('Comments', CommentSchema)

export default Comment
