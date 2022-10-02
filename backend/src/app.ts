require('dotenv').config()

import { errors } from 'celebrate'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import UserManager from './domains/user/manager'
import MongoStore from 'connect-mongo'
import { connectDB, mongoConnectionString } from './lib/mongo'
import { localStrategy } from './lib/auth-strategies'
import errorHandler from './lib/error-handler'

const port = process.env.PORT || 4000
const env = process.env.NODE_ENV || 'development'

const app = express()

connectDB()

app.use(
  cors({
    origin: true,
    credentials: Boolean(process.env.ALLOW_CORS_CREDENTIALS),
  })
)

app.set('trust proxy', 1)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(helmet())
app.use(compression())
app.use(cookieParser())
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoConnectionString,
      stringify: false,
    }),
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'somesupersecretthing',
    resave: false,
    cookie: {
      domain: process.env.COOKIE_DOMAIN,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      sameSite: env === 'production' ? 'none' : true,
      secure: env === 'production',
      httpOnly: true,
    },
  })
)

passport.use(localStrategy)
passport.serializeUser(UserManager.serializeUser())
passport.deserializeUser(UserManager.deserializeUser())

app.use(passport.initialize())
app.use(passport.session())

app.use('/account', require('./domains/account/router').default)
app.use('/user', require('./domains/user/router').default)

app.use(errors())
app.use(errorHandler)

app.listen(port, () => {
  console.log(`App listening on the port ${port} [${env}]`)
})

export default app
