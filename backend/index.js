import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import ExerciseGroup from './models/exercise.js'
dotenv.config()


const app = express()
const PORT = process.env.PORT || 3000
const URI = process.env.MONGODB_URI 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async(req, res) => {
  let exercises;
  try{
    exercises = await ExerciseGroup.find();
  }catch(err){
    return res.status(500).json({ error: `Failed to fetch exercises because of ${err}` })
  } 
  return res.status(200).json({ exercises })
})

app.post('/', async (req, res) => {
  try{
    const { muscleGroup,exercises } = req.body;
    const Exercise = new ExerciseGroup({
      muscleGroup : muscleGroup,
      exercises : exercises
    })

    await Exercise.save();
    return res.status(201).json({ message: 'Exercise created successfully', exercise: Exercise })
  }catch(err){
    return res.status(500).json({ error: `Failed to create exercise because ${err}` })
  }
})


mongoose.connect(URI).
then(
    app.listen(PORT, () => {
    console.log(`Connection is Successful\nServer is running on port ${PORT}`)
  })
).catch((err) => {
  console.error('Failed to connect to MongoDB', err)
})