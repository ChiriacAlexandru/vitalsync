import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'
import User from '../../models/User.js'

const signToken = (user) =>
  jwt.sign(
    {
      id: String(user._id),
      role: user.role,
      email: user.email,
    },
    env.jwtSecret,
    { expiresIn: '24h' },
  )

export const registerUser = async ({ email, password, role, name, specialty, availability }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    const error = new Error('Utilizatorul exista deja.')
    error.status = 400
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    email,
    password: passwordHash,
    role,
    name,
    specialty,
    availability,
  })

  return {
    token: signToken(user),
    user: {
      id: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name,
    },
  }
}

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    const error = new Error('Date de autentificare invalide.')
    error.status = 400
    throw error
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    const error = new Error('Date de autentificare invalide.')
    error.status = 400
    throw error
  }

  return {
    token: signToken(user),
    user: {
      id: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name || user.email,
      specialty: user.specialty,
    },
  }
}
