import mongoose from 'mongoose'
import dns from 'dns'
import { env } from './env.js'

export async function connectDatabase() {
  try {
    if (env.mongodbUri.startsWith('mongodb+srv://')) {
      dns.setServers(['8.8.8.8', '1.1.1.1'])
    }

    await mongoose.connect(env.mongodbUri, {
      dbName: env.mongodbDb,
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}
