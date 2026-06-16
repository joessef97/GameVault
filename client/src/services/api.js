import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);


// Games
export const getGames = (params) => api.get('/games', { params });
export const getGameDetails = (id) => api.get(`/games/${id}`);
export const getGameScreenshots = (id) => api.get(`/games/${id}/screenshots`);
export const getGenres = () => api.get('/games/genres');
export const getPlatforms = () => api.get('/games/platforms');

// Favorites
export const getFavorites = () => api.get('/favorites');
export const addFavorite = (data) => api.post('/favorites', data);
export const removeFavorite = (gameId) => api.delete(`/favorites/${gameId}`);
export const checkFavorite = (gameId) => api.get(`/favorites/check/${gameId}`);

// Reviews
export const getGameReviews = (gameId) => api.get(`/reviews/game/${gameId}`);
export const getUserReviews = () => api.get('/reviews/user/me');
export const createReview = (data) => api.post('/reviews', data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const toggleLike = (id) => api.post(`/reviews/${id}/like`);

// Admin
export const getDashboard = () => api.get('/admin/dashboard');
export const getAllUsers = () => api.get('/admin/users');
export const getAllReviews = () => api.get('/admin/reviews');
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);
export const adminDeleteReview = (id) => api.delete(`/admin/reviews/${id}`);
export const updateUserRole = (id, data) => api.put(`/admin/users/${id}/role`, data);

export default api;
