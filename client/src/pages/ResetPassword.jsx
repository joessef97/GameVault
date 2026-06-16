import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Gamepad2, CheckCircle } from 'lucide-react';
import { resetPassword } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetCompleted, setResetCompleted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await resetPassword(token, { password: formData.password });
      toast.success(response.data.message || 'Password reset successful!');
      setResetCompleted(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid or expired token. Please request a new link.';
      setErrors({ global: errMsg });
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/20 mb-4">
              <Gamepad2 className="w-8 h-8 text-accent-primary" />
            </div>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-gray-400 mt-1">Enter your new password below</p>
          </div>

          {resetCompleted ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center text-gaming-green">
                <CheckCircle className="w-16 h-16 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white">Success!</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Your password has been successfully reset. 
                  You will be redirected to the sign-in page in a few seconds...
                </p>
              </div>
              <Link
                to="/login"
                className="btn-primary w-full justify-center text-sm py-2.5"
              >
                Go to Sign In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.global && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {errors.global}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, password: e.target.value }));
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={`input-field pl-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Reset Password'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Request new link
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
