import { Router } from 'express';
import authRoutes from './auth';
import articleRoutes from './articles';
import paymentRoutes from './payments'

const router = Router();

router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/payments', paymentRoutes);

export default router;
