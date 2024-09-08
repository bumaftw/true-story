import { Router } from 'express';
import authRoutes from './auth';
import articleRoutes from './articles';

const router = Router();

router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);

export default router;
