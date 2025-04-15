import express from 'express'
import {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser
} from '../controllers/userController'
import { auth } from '../middleware/auth' // 🔒 import your JWT middleware

const router = express.Router()

// ✅ Protect all user routes with JWT
router.use(auth)

router.get('/', getUsers)
router.post('/', createUser)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
