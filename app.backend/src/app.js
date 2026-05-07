import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import routes from './routes/index.js'
import { env } from './config/env.js'

const app = express()

app.use(
  cors({
    origin: env.frontendUrl,
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

export default app
