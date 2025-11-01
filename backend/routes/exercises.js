import Router from 'express';
import { getexercises, createexercise, deleteexercise, updateexercise } from '../controllers/exercises.controller.js';

const router = Router();

router.get('/',getexercises);
router.post('/',createexercise);
router.delete('/:id',deleteexercise);
router.patch('/:id',updateexercise);

export default router;  