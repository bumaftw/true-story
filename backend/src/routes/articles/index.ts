import { Router } from 'express';
import { getArticles, getArticleById } from '../../controllers/articleController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', verifyToken, getArticles);
router.get('/:id', verifyToken, getArticleById);

export default router;
