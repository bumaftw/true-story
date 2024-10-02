import { Router } from 'express';
import {
  getProfile,
  getProfileByPublicKey,
  updateProfile,
} from '../../controllers/profileController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', verifyToken, getProfile);
router.put('/', verifyToken, updateProfile);
router.get('/:publicKey', verifyToken, getProfileByPublicKey);

export default router;
