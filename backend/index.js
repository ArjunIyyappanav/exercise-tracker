import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import router from './routes/exercises.js'
import cors from 'cors'
dotenv.config()


const app = express()
const PORT = process.env.PORT || 3000
const URI = process.env.MONGODB_URI 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}))

app.use('/api', router)


mongoose.connect(process.env.MONGO_URI).
then(
    app.listen(PORT, () => {
    console.log(`Connection is Successful\nServer is running on port ${PORT}`)
  })
).catch((err) => {
  console.error('Failed to connect to MongoDB', err)
})