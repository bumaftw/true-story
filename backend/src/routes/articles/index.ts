import { Router } from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
} from '../../controllers/articleController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', getArticles);
router.post('/', verifyToken(), createArticle);
router.get('/:id', verifyToken({ required: false }), getArticleById);

export default router;
