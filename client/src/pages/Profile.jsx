import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Star, MessageSquare, Edit2, Save, Gamepad2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserReviews, updateProfile } from '../services/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', bio: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username || '', bio: user.bio || '' });
    }
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      const { data } = await getUserReviews();
      setReviews(data);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await updateProfile(formData);
      updateUser(data);
      setEditing(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary 
                          flex items-center justify-center text-3xl font-bold text-white shrink-0">
              {user.username?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-start justify-between">
                <div>
                  {editing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="input-field text-lg font-semibold"
                      />
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className="input-field resize-none"
                        rows={2}
                        placeholder="Tell us about yourself..."
                        maxLength={500}
                      />
                      <div className="flex gap-2">
                        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
                          <Save className="w-4 h-4" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={() => setEditing(false)} className="btn-secondary text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold">{user.username}</h1>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {user.bio && (
                        <p className="mt-3 text-gray-300">{user.bio}</p>
                      )}
                    </>
                  )}
                </div>

                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-secondary text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-dark-600/50">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">{user.favoriteGames?.length || 0}</div>
              <div className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-1">
                <Gamepad2 className="w-3 h-3" />
                Favorites
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">{reviews.length}</div>
              <div className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-1">
                <MessageSquare className="w-3 h-3" />
                Reviews
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">
                {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-1">
                <Star className="w-3 h-3" />
                Avg Rating
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent-primary" />
            My Reviews
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="bg-dark-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <Link
                      to={`/game/${review.gameId}`}
                      className="font-medium text-accent-primary hover:underline"
                    >
                      {review.gameName}
                    </Link>
                    <span className="px-2 py-1 bg-accent-primary/20 text-accent-primary rounded text-sm font-semibold">
                      {review.rating}/10
                    </span>
                  </div>
                  <p className="mt-2 text-gray-300 text-sm">{review.content}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-dark-600" />
              <p>No reviews yet</p>
              <p className="text-sm mt-1">Start reviewing your favorite games</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
