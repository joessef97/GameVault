import Favorite from '../models/Favorite.js';
import User from '../models/User.js';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { gameId, gameName, gameImage, gameRating, gameReleased } = req.body;

    const existing = await Favorite.findOne({ user: req.user._id, gameId });
    if (existing) {
      return res.status(400).json({ message: 'Game already in favorites' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      gameId,
      gameName,
      gameImage,
      gameRating,
      gameReleased
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { favoriteGames: gameId }
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { gameId } = req.params;

    await Favorite.findOneAndDelete({ user: req.user._id, gameId });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { favoriteGames: parseInt(gameId) }
    });

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkFavorite = async (req, res) => {
  try {
    const { gameId } = req.params;
    const favorite = await Favorite.findOne({ user: req.user._id, gameId });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
