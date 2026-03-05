import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import aiRouter from './routes/ai.js'
import authRouter from './routes/auth.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/ai', aiRouter)
app.use('/api/auth', authRouter)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
