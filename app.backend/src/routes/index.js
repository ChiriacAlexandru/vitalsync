import { Router } from 'express'
import authRoutes from './auth/authRoutes.js'
import medicRoutes from './medic/medicRoutes.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'vitalsync-bff',
  })
})

router.use('/auth', authRoutes)
router.use('/bff', medicRoutes)

export default router
