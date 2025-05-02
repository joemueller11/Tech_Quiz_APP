import express from 'express';
const router = express.Router();
import questionRoutes from './questionRoutes.js';

router.use('/questions', questionRoutes);

export default router;
