import Router from 'express'
import ExerciseGroup from '../models/exercise.js'

const router = Router();

router.get('/',getexercises);