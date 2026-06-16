import express from 'express';
import {
  getGameReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLike
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/game/:gameId', getGameReviews);
router.get('/user/me', protect, getUserReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/like', protect, toggleLike);

export default router;
