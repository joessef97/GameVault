import express from 'express';
import {
  getGames,
  getGameDetails,
  getGameScreenshots,
  getGenres,
  getPlatforms,
} from '../controllers/gameController.js';

const router = express.Router();

router.get('/', getGames);
router.get('/genres', getGenres);
router.get('/platforms', getPlatforms);
router.get('/:id', getGameDetails);
router.get('/:id/screenshots', getGameScreenshots);

export default router;
