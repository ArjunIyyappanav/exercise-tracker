import mongoose from 'mongoose'

const SetSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, required: false }, // optional if bodyweight
  notes: { type: String },
}, { _id: false }) // _id not needed for small subdocs

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: [SetSchema], // array of set objects
})

const MuscleGroupSchema = new mongoose.Schema({
  muscleGroup: { type: String, required: true }, // e.g. 'Chest'
  exercises: [ExerciseSchema], // array of exercises
  date: { type: Date, default: Date.now }
})

export default mongoose.model('ExerciseGroup', MuscleGroupSchema)