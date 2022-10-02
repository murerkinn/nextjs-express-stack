import { model, Document, Schema, Model } from 'mongoose'
import bcrypt from 'bcrypt'

export interface UserRaw {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface UserDocument extends Document, Omit<UserRaw, 'password'> {
  hash: string

  validatePassword(password: string): Promise<boolean>
}

export interface UserModel extends Model<UserDocument> {
  calculateHash(password: string): Promise<string>
}

const userSchema = new Schema<UserDocument, UserModel>(
  {
    email: {
      type: String,
      unique: true,
    },
    hash: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
    },
  },
  { timestamps: true }
)

userSchema.statics.calculateHash = async function (
  this: UserModel,
  password: string
) {
  return bcrypt.hash(password, 10)
}

userSchema.methods.validatePassword = async function (
  this: UserDocument,
  password: string
) {
  return bcrypt.compare(password, this.hash)
}

export default model<UserDocument, UserModel>('User', userSchema)
