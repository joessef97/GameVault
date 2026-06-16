import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { getGames, getGenres, getPlatforms } from '../services/api';
import GameCard from '../components/GameCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    genre: searchParams.get('genre') || '',
    platform: searchParams.get('platform') || '',
    ordering: searchParams.get('ordering') || '-relevance',
    page: parseInt(searchParams.get('page')) || 1
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchGames();
  }, [filters]);

  const fetchFilters = async () => {
    try {
      const [genresRes, platformsRes] = await Promise.all([
        getGenres(),
        getPlatforms()
      ]);
      setGenres(genresRes.data.results);
      setPlatforms(platformsRes.data.results);
    } catch (error) {
      console.error('Failed to fetch filters:', error);
    }
  };

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        page_size: 20,
        ...(filters.q && { search: filters.q }),
        ...(filters.genre && { genres: filters.genre }),
        ...(filters.platform && { platforms: filters.platform }),
        ordering: filters.ordering
      };

      const response = await getGames(params);
      setGames(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 20));
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, String(v));
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ q: '', genre: '', platform: '', ordering: '-relevance', page: 1 });
    setSearchParams({});
  };

  const hasActiveFilters = filters.genre || filters.platform || filters.q;

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Discover Games</h1>

          {/* Search & Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => updateFilter('q', e.target.value)}
                placeholder="Search games..."
                className="input-field pl-10 w-full"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary ${showFilters ? 'bg-dark-600' : ''}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-accent-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 glass-panel p-4 animate-slide-up">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => updateFilter('genre', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Genres</option>
                    {genres.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                  <select
                    value={filters.platform}
                    onChange={(e) => updateFilter('platform', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Platforms</option>
                    {platforms.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <select
                    value={filters.ordering}
                    onChange={(e) => updateFilter('ordering', e.target.value)}
                    className="input-field"
                  >
                    <option value="-relevance">Relevance</option>
                    <option value="-rating">Highest Rated</option>
                    <option value="-metacritic">Metacritic Score</option>
                    <option value="-released">Newest</option>
                    <option value="released">Oldest</option>
                    <option value="name">Name A-Z</option>
                    <option value="-name">Name Z-A</option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.q && (
                <span className="inline-flex items-center gap-1 bg-accent-primary/20 text-accent-primary px-3 py-1 rounded-full text-sm">
                  Search: {filters.q}
                  <button onClick={() => updateFilter('q', '')} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.genre && (
                <span className="inline-flex items-center gap-1 bg-accent-primary/20 text-accent-primary px-3 py-1 rounded-full text-sm">
                  Genre: {genres.find(g => g.id.toString() === filters.genre)?.name}
                  <button onClick={() => updateFilter('genre', '')} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : games.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {games.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
            <Pagination
              currentPage={filters.page}
              totalPages={Math.min(totalPages, 50)}
              onPageChange={(page) => updateFilter('page', page)}
            />
          </>
        ) : (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-gray-400">
            <Search className="w-16 h-16 mb-4 text-dark-600" />
            <p className="text-lg font-medium">No games found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
