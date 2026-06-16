import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Calendar, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addFavorite, removeFavorite } from '../services/api';
import toast from 'react-hot-toast';

const GameCard = ({ game, isFavorite: initialFavorite, onFavoriteChange }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(game.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addFavorite({
          gameId: game.id,
          gameName: game.name,
          gameImage: game.background_image,
          gameRating: game.rating,
          gameReleased: game.released
        });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
      onFavoriteChange?.();
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-gaming-green';
    if (rating >= 3) return 'text-gaming-yellow';
    return 'text-gaming-red';
  };

  const platforms = game.parent_platforms?.map(p => p.platform.name).slice(0, 4) || [];

  return (
    <Link
      to={`/game/${game.id}`}
      className="card game-card-hover group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-dark-700 animate-pulse" />
        )}
        <img
          src={game.background_image || '/placeholder-game.jpg'}
          alt={game.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent 
                        transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorite
              ? 'bg-red-500/90 text-white'
              : 'bg-dark-800/80 text-gray-300 hover:bg-red-500/90 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-dark-800/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          <Star className={`w-4 h-4 ${getRatingColor(game.rating)} fill-current`} />
          <span className={`text-sm font-semibold ${getRatingColor(game.rating)}`}>
            {game.rating?.toFixed(1) || 'N/A'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white truncate group-hover:text-accent-primary transition-colors">
          {game.name}
        </h3>

        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          {game.released && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(game.released).getFullYear()}</span>
            </div>
          )}
          {game.metacritic && (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              game.metacritic >= 75 ? 'bg-gaming-green/20 text-gaming-green' :
              game.metacritic >= 50 ? 'bg-gaming-yellow/20 text-gaming-yellow' :
              'bg-gaming-red/20 text-gaming-red'
            }`}>
              {game.metacritic}
            </span>
          )}
        </div>

        {/* Platforms */}
        {platforms.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {platforms.map(platform => (
              <span
                key={platform}
                className="text-[10px] bg-dark-600/80 text-gray-400 px-2 py-0.5 rounded"
              >
                {platform}
              </span>
            ))}
          </div>
        )}

        {/* Genres */}
        {game.genres?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {game.genres.slice(0, 3).map(genre => (
              <span
                key={genre.id}
                className="text-[10px] bg-accent-primary/10 text-accent-secondary px-2 py-0.5 rounded"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default GameCard;
