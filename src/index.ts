import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth'
import userRoutes from './routes/routes'

const app = express()

app.use(express.json())
app.use(cookieParser()) 

app.use('/auth', authRoutes)
app.use('/users', userRoutes)

app.listen(3000, () => console.log('Server running on http://localhost:3000'))
