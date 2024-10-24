import { Router } from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  pinArticle,
  unpinArticle,
} from '../../controllers/articleController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', verifyToken({ required: false }), getArticles);
router.post('/', verifyToken(), createArticle);
router.get('/:id', verifyToken({ required: false }), getArticleById);
router.put('/:id', verifyToken(), updateArticle);
router.delete('/:id', verifyToken(), deleteArticle);
router.put('/:id/pin', verifyToken(), pinArticle);
router.put('/:id/unpin', verifyToken(), unpinArticle);

export default router;
