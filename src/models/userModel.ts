// models/userModel.ts
import { User } from '../types/user'

const users: User[] = []

export const getUsers = async (): Promise<User[]> => {
  return users
}

export const createUser = async (user: User): Promise<User> => {
  users.push(user)
  return user
}

export const getUserById = async (id: number): Promise<User | null> => {
  const user = users.find(u => u.id === id)
  return user || null
}

export const deleteUser = async (id: number): Promise<boolean> => {
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return false

  users.splice(index, 1)
  return true
}

export const updateUser = async (
  id: number,
  updates: Partial<User>
): Promise<User | null> => {
  const user = users.find(u => u.id === id)
  if (!user) return null

  if (updates.name !== undefined) user.name = updates.name
  if (updates.email !== undefined) user.email = updates.email

  return user
}
