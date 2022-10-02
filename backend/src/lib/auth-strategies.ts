import { Request, RequestHandler } from 'express-async-router'
import { BadRequest, Unauthorized } from 'http-errors'
import { Strategy as LocalStrategy } from 'passport-local'

import UserManager from '@/domains/user/manager'
import { UserDocument } from '@/domains/user/models/user'

export interface AuthenticatedRequest extends Request {
  user: UserDocument
}

export const ensureOrphans: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated())
    return next(
      new BadRequest(
        'There is an ongoing session. Please logout in order to perform this action.'
      )
    )
  next()
}

export const ensureAuthentication: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) return next(new Unauthorized())

  next()
}

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (
    email: string,
    password: string,
    done: (err: any, user?: UserDocument) => void
  ) => {
    try {
      const user = await UserManager.authenticate(email, password)

      done(null, user)
    } catch (err) {
      done(err)
    }
  }
)
