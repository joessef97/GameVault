import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile, forgotPassword, resetPassword, testSmtp } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required')
], forgotPassword);

router.post('/test-smtp', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required')
], testSmtp);

router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], resetPassword);

export default router;

