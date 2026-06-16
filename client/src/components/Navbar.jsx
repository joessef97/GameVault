import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Search,
  Heart,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Gamepad2 },
    { to: '/search', label: 'Discover', icon: Search },
    ...(isAuthenticated ? [
      { to: '/favorites', label: 'Favorites', icon: Heart },
      { to: '/profile', label: 'Profile', icon: User },
    ] : []),
    ...(isAdmin ? [
      { to: '/admin', label: 'Admin', icon: Shield },
    ] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Gamepad2 className="w-8 h-8 text-accent-primary group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold gradient-text">GameVault</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  location.pathname === to
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : 'hover:bg-dark-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{user?.username}</span>
                <button
                  onClick={logout}
                  className="btn-secondary text-sm py-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-700 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-600 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === to
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : 'hover:bg-dark-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-700 text-red-400 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="btn-secondary flex-1 justify-center">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/register" className="btn-primary flex-1 justify-center">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
