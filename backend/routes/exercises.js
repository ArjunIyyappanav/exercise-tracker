import Router from 'express';

const router = Router();

router.get('/',getexercises);
router.post('/',createexercise);
router.delete('/:id',deleteexercise);
router.patch('/:id',updateexercise);

export default router;  