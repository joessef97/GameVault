import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, Calendar, ChevronRight, Flame, Award, Clock } from 'lucide-react';
import { getGames } from '../services/api';
import GameCard from '../components/GameCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [trendingGames, setTrendingGames] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const [trendingRes, topRatedRes, upcomingRes] = await Promise.all([
        getGames({ ordering: '-relevance', page_size: 8 }),
        getGames({ ordering: '-rating', page_size: 8, metacritic: '80,100' }),
        getGames({
          ordering: '-released',
          dates: `${new Date().toISOString().split('T')[0]},${new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]}`,
          page_size: 8
        })
      ]);

      setTrendingGames(trendingRes.data.results);
      setTopRated(topRatedRes.data.results);
      setUpcoming(upcomingRes.data.results);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent-primary/20 rounded-lg">
          <Icon className="w-5 h-5 text-accent-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>
      <Link to="/search" className="flex items-center gap-1 text-accent-primary hover:text-accent-secondary text-sm font-medium transition-colors">
        View All
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
            Discover Your Next
            <span className="gradient-text block mt-2">Gaming Adventure</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Explore thousands of games, track your favorites, write reviews, and find your perfect gaming experience.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">500K+</div>
              <div className="text-sm text-gray-400">Games</div>
            </div>
            <div className="w-px h-10 bg-dark-600" />
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">50+</div>
              <div className="text-sm text-gray-400">Platforms</div>
            </div>
            <div className="w-px h-10 bg-dark-600" />
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">40+</div>
              <div className="text-sm text-gray-400">Genres</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Games */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            icon={Flame}
            title="Trending Now"
            subtitle="Most popular games this week"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 bg-dark-800/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            icon={Award}
            title="Top Rated"
            subtitle="Highest rated games of all time"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRated.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            icon={Clock}
            title="Coming Soon"
            subtitle="Upcoming releases to watch"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcoming.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
