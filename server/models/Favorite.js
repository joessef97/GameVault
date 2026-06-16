import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
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
  gameRating: {
    type: Number,
    default: 0
  },
  gameReleased: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

favoriteSchema.index({ user: 1, gameId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
