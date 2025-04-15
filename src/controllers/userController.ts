import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export const getUsers = async (_: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true } // no password
  })
  res.json(users)
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id)
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true }
  })

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  res.json(user)
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields required' })
    return
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(400).json({ message: 'Email already in use' })
    return
  }

  const user = await prisma.user.create({
    data: { name, email, password }
  })

  res.status(201).json({ id: user.id, name: user.name, email: user.email })
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id)
  const { name, email } = req.body

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { name, email }
  })

  res.json({ id: updated.id, name: updated.name, email: updated.email })
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id)

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  await prisma.user.delete({ where: { id } })
  res.json({ message: 'User deleted' })
}
