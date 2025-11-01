import ExerciseGroup from '../models/exercise.js'


export const getexercises = async(req, res) => {
  let exercises;
  try{
    exercises = await ExerciseGroup.find();
  }catch(err){
    return res.status(500).json({ error: `Failed to fetch exercises because of ${err}` })
  } 
  return res.status(200).json({ exercises })
}

export const createexercise = async (req, res) => {
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
}

export const deleteexercise = async (req, res) => {
  const { id } = req.params;  
  try{
    await ExerciseGroup.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Exercise deleted successfully' })
  }catch(err){
    return res.status(500).json({ error: `Failed to delete exercise because ${err}` })
  }   
}

export const updateexercise =  async (req, res) => {
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
}