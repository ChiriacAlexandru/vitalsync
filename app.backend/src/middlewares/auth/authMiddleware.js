import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Lipseste tokenul de autentificare.' })
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret)
    return next()
  } catch (_error) {
    return res.status(401).json({ message: 'Token invalid sau expirat.' })
  }
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Acces interzis pentru rolul curent.' })
  }

  return next()
}
