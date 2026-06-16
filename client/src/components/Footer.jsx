import { Gamepad2, Github, Twitter, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-600/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-6 h-6 text-accent-primary" />
              <span className="text-lg font-bold gradient-text">GameVault</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover, track, and review your favorite games. Your ultimate gaming companion powered by the RAWG API.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-accent-primary text-sm transition-colors">Home</Link></li>
              <li><Link to="/search" className="text-gray-400 hover:text-accent-primary text-sm transition-colors">Discover Games</Link></li>
              <li><Link to="/favorites" className="text-gray-400 hover:text-accent-primary text-sm transition-colors">My Favorites</Link></li>
              <li><Link to="/profile" className="text-gray-400 hover:text-accent-primary text-sm transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Connect</h3>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-dark-700 rounded-lg hover:bg-accent-primary hover:text-white transition-all text-gray-400">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-dark-700 rounded-lg hover:bg-accent-primary hover:text-white transition-all text-gray-400">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-600/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2024 GameVault. Built with <Heart className="w-3 h-3 inline text-red-500" /> for gamers.
          </p>
          <p className="text-gray-600 text-xs">
            Powered by RAWG API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
