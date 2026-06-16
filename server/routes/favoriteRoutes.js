import express from 'express';
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.get('/check/:gameId', checkFavorite);
router.delete('/:gameId', removeFavorite);

export default router;
