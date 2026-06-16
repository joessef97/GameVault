import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  MessageSquare,
  Heart,
  Trash2,
  Crown,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import { getDashboard, getAllUsers, getAllReviews, adminDeleteUser, adminDeleteReview, updateUserRole } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, usersRes, reviewsRes] = await Promise.all([
        getDashboard(),
        getAllUsers(),
        getAllReviews()
      ]);
      setStats(dashRes.data.stats);
      setUsers(usersRes.data);
      setReviews(reviewsRes.data);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await adminDeleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await adminDeleteReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, { role: newRole });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  ];

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
          <button onClick={() => navigate(-1)} className="btn-secondary p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-accent-primary" />
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage users, reviews, and platform data</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Total Reviews', value: stats?.totalReviews, icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'Total Favorites', value: stats?.totalFavorites, icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Admins', value: stats?.adminCount, icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          ].map((stat, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent-primary text-white'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Recent Users</h3>
              <div className="space-y-3">
                {users.slice(0, 5).map(u => (
                  <div key={u._id} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-sm font-semibold text-accent-primary">
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.username}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      u.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-dark-600 text-gray-400'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold mb-4">Recent Reviews</h3>
              <div className="space-y-3">
                {reviews.slice(0, 5).map(r => (
                  <div key={r._id} className="p-3 bg-dark-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-accent-primary">{r.gameName}</span>
                      <span className="text-xs bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded">
                        {r.rating}/10
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">by {r.user.username}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-700/50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">User</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Email</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Role</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Joined</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600/50">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-sm font-semibold text-accent-primary">
                            {u.username[0].toUpperCase()}
                          </div>
                          <span className="font-medium">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-dark-700 border border-dark-600 rounded px-2 py-1 text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-700/50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Game</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">User</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Rating</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Content</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600/50">
                  {reviews.map(r => (
                    <tr key={r._id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-accent-primary">{r.gameName}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{r.user.username}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded">
                          {r.rating}/10
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">{r.content}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteReview(r._id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
