import User, { UserDocument } from './models/user'
import {
  NotFound as NotFoundError,
  Unauthorized as UnauthorizedRequestError,
} from 'http-errors'

const authenticate = async (email: string, password: string) => {
  email = email.toLowerCase()

  const user = await User.findOne({ email })

  if (!user) {
    console.log(`Email ${email} not found`)

    throw new NotFoundError('User not found')
  }

  if (!(await user.validatePassword(password))) {
    console.log(`Email ${email} tried authenticating with wrong password`)

    throw new UnauthorizedRequestError('Invalid password')
  }

  user.hash = ''

  return user
}

const serializeUser = () => {
  return (user: any, done: any) => {
    done(null, user._id)
  }
}

const deserializeUser = () => {
  return (id: string, done: (err: null, user?: UserDocument) => void) => {
    return User.findOne({ _id: id })
      .then(user => {
        if (!user) return done(null)

        done(null, user)
      })
      .catch(() => {
        done(null)
      })
  }
}

const UserManager = {
  authenticate,
  serializeUser,
  deserializeUser,
}

export default UserManager
