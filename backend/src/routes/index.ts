import { Router } from 'express';
import authRoutes from './auth';
import articleRoutes from './articles';
import paymentRoutes from './payments';
import profileRoutes from './profile';

const router = Router();

router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/payments', paymentRoutes);
router.use('/profile', profileRoutes);

export default router;
