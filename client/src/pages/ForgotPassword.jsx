import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Gamepad2, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await forgotPassword({ email });
      toast.success(response.data.message || 'Reset link sent successfully!');
      setSubmitted(true);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errMsg);
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
            <h1 className="text-2xl font-bold">Forgot Password?</h1>
            <p className="text-gray-400 mt-1">
              Enter your email to receive a password reset link
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center text-gaming-green">
                <CheckCircle className="w-16 h-16 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white">Check your email</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  We've sent a link to <span className="text-accent-primary font-medium">{email}</span>. 
                  Click the link in the email to reset your password.
                </p>
              </div>
              <Link
                to="/login"
                className="btn-secondary w-full justify-center text-sm py-2.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className={`input-field pl-10 ${error ? 'border-red-500' : ''}`}
                    placeholder="you@example.com"
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
