import Review from '../models/Review.js';
import User from '../models/User.js';

export const getGameReviews = async (req, res) => {
  try {
    const { gameId } = req.params;
    const reviews = await Review.find({ gameId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { gameId, gameName, gameImage, rating, content } = req.body;

    const existingReview = await Review.findOne({
      user: req.user._id,
      gameId
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.content = content;
      await existingReview.save();

      const populated = await existingReview.populate('user', 'username avatar');
      return res.json(populated);
    }

    const review = await Review.create({
      user: req.user._id,
      gameId,
      gameName,
      gameImage,
      rating,
      content
    });

    const populated = await review.populate('user', 'username avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content } = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { rating, content },
      { new: true }
    ).populate('user', 'username avatar');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOneAndDelete({
      _id: id,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const hasLiked = review.likes.includes(req.user._id);

    if (hasLiked) {
      review.likes.pull(req.user._id);
    } else {
      review.likes.push(req.user._id);
    }

    await review.save();
    res.json({ likes: review.likes.length, hasLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
