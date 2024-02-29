import { Document, Schema, model } from 'mongoose'
import * as bcrypt from 'bcrypt'

export interface IUser extends Document {
  username: string
  password: string
  isAdmin: boolean
  comparePasswords(candidatePassword: string): Promise<boolean>
}

const SALT_WORK_FACTOR = 10

export const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      index: {
        unique: true
      }
    },
    password: {
      type: String,
      require: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
      }
    }
  }
)

UserSchema.pre('save', async function (this, next) {
  const thisObj = this as IUser

  if (!this.isModified('password')) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    thisObj.password = await bcrypt.hash(thisObj.password, salt)
    return next()
  } catch (e: any) {
    return next(e)
  }
})

UserSchema.methods.comparePasswords = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = model<IUser>('Users', UserSchema)

export default User
