import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import aiRouter from './routes/ai.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/ai', aiRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
