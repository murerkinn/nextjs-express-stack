import mongoose from 'mongoose'

mongoose.set('debug', false)

export const mongoConnectionString =
  process.env.MONGO_URI || 'mongodb://localhost:27017/nextjs-express-stack'

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoConnectionString)

    console.log('Database connection established')
  } catch (e) {
    console.error(`Could not establish connection to ${mongoConnectionString}`)
  }
}
