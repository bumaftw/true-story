import { Router } from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
} from '../../controllers/articleController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', getArticles);
router.post('/', verifyToken(), createArticle);
router.get('/:id', verifyToken({ required: false }), getArticleById);
router.put('/:id', verifyToken(), updateArticle);

export default router;
