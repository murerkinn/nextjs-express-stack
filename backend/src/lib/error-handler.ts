import { ErrorHandler } from 'express-async-router'

const errorHandler: ErrorHandler = (err, req, res, next) => {
  if (!err.status) {
    res.status(500).send({ message: err.message })
  } else {
    res.status(err.status).send(err)
  }
}

export default errorHandler
