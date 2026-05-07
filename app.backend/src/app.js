import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import routes from './routes/index.js'
import { env } from './config/env.js'

const app = express()

const allowedOrigins = env.frontendUrl.split(',').map((s) => s.trim())

app.use(
  cors({
    origin: allowedOrigins,
  }),
)
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'VitalSync backend is running.',
  })
})

app.use('/api', routes)

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(error.status || 500).json({
    message: error.message || 'Eroare server.',
  })
})

export default app
