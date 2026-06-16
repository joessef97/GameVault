import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: Number,
    required: true
  },
  gameName: {
    type: String,
    required: true
  },
  gameImage: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [2000, 'Review cannot exceed 2000 characters']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

reviewSchema.index({ gameId: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
