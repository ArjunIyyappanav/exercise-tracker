import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import ExerciseGroup from './models/exercise.js'
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

app.delete('/:id', async (req, res) => {
  const { id } = req.params;  
  try{
    await ExerciseGroup.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Exercise deleted successfully' })
  }catch(err){
    return res.status(500).json({ error: `Failed to delete exercise because ${err}` })
  }   
})

app.patch('/:id', async (req, res) => {
  const { id } = req.params;  
  const { muscleGroup, exercises } = req.body;  
  try{
    const updatedExercise = await ExerciseGroup.findByIdAndUpdate(
      id,
      { muscleGroup, exercises },       

      { new: true }
    );
    return res.status(200).json({ message: 'Exercise updated successfully', exercise: updatedExercise })
  }catch(err){
    return res.status(500).json({ error: `Failed to update exercise because ${err}` })
  } 
})


mongoose.connect(process.env.MONGO_URI).
then(
    app.listen(PORT, () => {
    console.log(`Connection is Successful\nServer is running on port ${PORT}`)
  })
).catch((err) => {
  console.error('Failed to connect to MongoDB', err)
})