import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Trash2, Star, Calendar } from 'lucide-react';
import { getFavorites, removeFavorite } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await getFavorites();
      setFavorites(data);
    } catch {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (gameId) => {
    try {
      await removeFavorite(gameId);
      setFavorites(prev => prev.filter(f => f.gameId !== parseInt(gameId)));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center pt-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="btn-secondary p-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" />
              My Favorites
            </h1>
            <p className="text-gray-400 mt-1">{favorites.length} games in your collection</p>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(fav => (
              <div key={fav._id} className="card overflow-hidden group">
                <Link to={`/game/${fav.gameId}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={fav.gameImage || '/placeholder-game.jpg'}
                      alt={fav.gameName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/game/${fav.gameId}`}>
                    <h3 className="font-semibold text-white hover:text-accent-primary transition-colors truncate">
                      {fav.gameName}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    {fav.gameRating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-gaming-yellow fill-current" />
                        {fav.gameRating.toFixed(1)}
                      </span>
                    )}
                    {fav.gameReleased && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(fav.gameReleased).getFullYear()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(fav.gameId)}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 
                             text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-gray-400">
            <Heart className="w-16 h-16 mb-4 text-dark-600" />
            <p className="text-lg font-medium">No favorites yet</p>
            <p className="text-sm mt-1 mb-6">Start exploring and add games to your collection</p>
            <Link to="/search" className="btn-primary">
              Discover Games
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
