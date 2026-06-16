import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Calendar,
  Clock,
  Globe,
  Monitor,
  Heart,
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Send,
  Trash2,
  Edit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getGameDetails, getGameScreenshots, getGameReviews, createReview, deleteReview, toggleLike, checkFavorite, addFavorite, removeFavorite } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 8, content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGameData();
  }, [id]);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const [gameRes, screenshotsRes, reviewsRes] = await Promise.all([
        getGameDetails(id),
        getGameScreenshots(id),
        getGameReviews(id)
      ]);

      setGame(gameRes.data);
      setScreenshots(screenshotsRes.data.results.slice(0, 6));
      setReviews(reviewsRes.data);

      if (isAuthenticated) {
        const favRes = await checkFavorite(id);
        setIsFavorite(favRes.data.isFavorite);
      }
    } catch (error) {
      toast.error('Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addFavorite({
          gameId: parseInt(id),
          gameName: game.name,
          gameImage: game.background_image,
          gameRating: game.rating,
          gameReleased: game.released
        });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await createReview({
        gameId: parseInt(id),
        gameName: game.name,
        gameImage: game.background_image,
        rating: reviewForm.rating,
        content: reviewForm.content
      });

      setReviews(prev => {
        const exists = prev.find(r => r.user._id === user?._id);
        if (exists) {
          return prev.map(r => r.user._id === user?._id ? data : r);
        }
        return [data, ...prev];
      });

      setReviewForm({ rating: 8, content: '' });
      toast.success('Review submitted!');
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const handleLike = async (reviewId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like');
      return;
    }
    try {
      const { data } = await toggleLike(reviewId);
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, likes: data.likes } : r));
    } catch {
      toast.error('Failed to like review');
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-gaming-green';
    if (rating >= 3) return 'text-gaming-yellow';
    return 'text-gaming-red';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center pt-20">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20">
        <p className="text-xl text-gray-400">Game not found</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    );
  }

  const userReview = reviews.find(r => r.user._id === user?._id);

  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary mb-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex flex-wrap items-end gap-4 justify-between">
              <div>
                <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">{game.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  {game.released && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(game.released).toLocaleDateString()}
                    </span>
                  )}
                  {game.playtime > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {game.playtime}h avg
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className={`w-4 h-4 ${getRatingColor(game.rating)} fill-current`} />
                    {game.rating?.toFixed(1)}/5
                  </span>
                  {game.metacritic && (
                    <span className={`px-2 py-0.5 rounded font-semibold text-sm ${
                      game.metacritic >= 75 ? 'bg-gaming-green/20 text-gaming-green' :
                      game.metacritic >= 50 ? 'bg-gaming-yellow/20 text-gaming-yellow' :
                      'bg-gaming-red/20 text-gaming-red'
                    }`}>
                      Metacritic: {game.metacritic}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleFavorite}
                className={`p-3 rounded-xl transition-all ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-dark-800/80 text-gray-300 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section className="card p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <div
                className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: game.description }}
              />
            </section>

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <section className="card p-6">
                <h2 className="text-xl font-bold mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {screenshots.map((shot, index) => (
                    <div key={index} className="rounded-lg overflow-hidden aspect-video">
                      <img
                        src={shot.image}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Reviews</h2>
                <span className="text-sm text-gray-400">{reviews.length} reviews</span>
              </div>

              {/* Review Form */}
              {isAuthenticated && !userReview && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-dark-700/50 rounded-lg">
                  <h3 className="font-medium mb-3">Write a Review</h3>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-400 mb-1">Rating: {reviewForm.rating}/10</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                      className="w-full accent-accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span><span>5</span><span>10</span>
                    </div>
                  </div>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your thoughts about this game..."
                    className="input-field min-h-[100px] resize-none"
                    required
                    minLength={10}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary mt-3"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="bg-dark-700/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
                          <span className="font-semibold text-accent-primary">
                            {review.user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{review.user.username}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-accent-primary/20 text-accent-primary rounded font-semibold text-sm">
                          {review.rating}/10
                        </span>
                        {review.user._id === user?._id && (
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-gray-300 text-sm leading-relaxed">{review.content}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <button
                        onClick={() => handleLike(review._id)}
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-accent-primary transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {review.likes?.length || 0}
                      </button>
                    </div>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-dark-600" />
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Genres */}
            <section className="card p-5">
              <h3 className="font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {game.genres?.map(g => (
                  <span key={g.id} className="bg-accent-primary/10 text-accent-secondary px-3 py-1 rounded-full text-sm">
                    {g.name}
                  </span>
                ))}
              </div>
            </section>

            {/* Platforms */}
            <section className="card p-5">
              <h3 className="font-semibold mb-3">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {game.platforms?.map(p => (
                  <span key={p.platform.id} className="bg-dark-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {p.platform.name}
                  </span>
                ))}
              </div>
            </section>

            {/* Developers */}
            {game.developers?.length > 0 && (
              <section className="card p-5">
                <h3 className="font-semibold mb-3">Developers</h3>
                <div className="space-y-2">
                  {game.developers.map(d => (
                    <div key={d.id} className="flex items-center gap-2 text-gray-300 text-sm">
                      <Globe className="w-4 h-4 text-gray-500" />
                      {d.name}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Publishers */}
            {game.publishers?.length > 0 && (
              <section className="card p-5">
                <h3 className="font-semibold mb-3">Publishers</h3>
                <div className="space-y-2">
                  {game.publishers.map(p => (
                    <div key={p.id} className="flex items-center gap-2 text-gray-300 text-sm">
                      <Monitor className="w-4 h-4 text-gray-500" />
                      {p.name}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Website */}
            {game.website && (
              <a
                href={game.website}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-5 flex items-center gap-3 hover:border-accent-primary/50 transition-colors block"
              >
                <Globe className="w-5 h-5 text-accent-primary" />
                <span className="text-accent-primary hover:underline">Official Website</span>
              </a>
            )}

            {/* Tags */}
            {game.tags?.length > 0 && (
              <section className="card p-5">
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {game.tags.slice(0, 10).map(t => (
                    <span key={t.id} className="bg-dark-700 text-gray-400 px-2 py-1 rounded text-xs">
                      {t.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
