import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT) || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vitalsync',
  mongodbDb: process.env.MONGODB_DB || 'vitalsync',
  jwtSecret: process.env.JWT_SECRET || 'vitalsync-dev-secret',
  demoDoctorEmail: process.env.DEMO_DOCTOR_EMAIL || 'medic.demo@vitalsync.ro',
  demoDoctorPassword: process.env.DEMO_DOCTOR_PASSWORD || 'Demo1234!',
}
