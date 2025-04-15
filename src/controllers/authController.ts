import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // set to true in production with HTTPS
  sameSite: 'lax' as const,
  maxAge: 1000 * 60 * 60 
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(400).json({ message: 'Invalid credentials' })
    return
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    res.status(400).json({ message: 'Invalid credentials' })
    return
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })

  res
    .cookie('token', token, COOKIE_OPTIONS)
    .status(200)
    .json({ message: 'Logged in successfully' })
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required' })
    return
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    res.status(400).json({ message: 'Email is already in use' })
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })

  res
    .cookie('token', token, COOKIE_OPTIONS)
    .status(201)
    .json({ message: 'User registered successfully' })
}
