import express from 'express';
import {
  getDashboard,
  getAllUsers,
  getAllReviews,
  deleteUser,
  deleteReview,
  updateUserRole
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.get('/reviews', getAllReviews);
router.delete('/users/:id', deleteUser);
router.delete('/reviews/:id', deleteReview);
router.put('/users/:id/role', updateUserRole);

export default router;
