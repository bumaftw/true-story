import { Router } from 'express';
import { verifyPayment } from '../../controllers/paymentController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/verify', verifyToken, verifyPayment);

export default router;
