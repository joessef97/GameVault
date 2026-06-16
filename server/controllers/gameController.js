import axios from 'axios';

const RAWG_BASE_URL = 'https://api.rawg.io/api';

// Use axios directly and add API key per-request to avoid import-time env issues
const rawgApi = axios.create({ baseURL: RAWG_BASE_URL });

export const getGames = async (req, res) => {
  try {
    const { page = 1, page_size = 20, search, genres, platforms, ordering, dates, tags } = req.query;
    
    const params = {
      page,
      page_size,
      ...(search && { search }),
      ...(genres && { genres }),
      ...(platforms && { platforms }),
      ...(ordering && { ordering }),
      ...(dates && { dates }),
      ...(tags && { tags })
    };

    const response = await rawgApi.get('/games', { params: { key: process.env.RAWG_API_KEY, ...params } });
    res.json(response.data);
  } catch (error) {
    console.error('RAWG getGames error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch games from RAWG API' });
  }
};

export const getGameDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await rawgApi.get(`/games/${id}`, { params: { key: process.env.RAWG_API_KEY } });
    res.json(response.data);
  } catch (error) {
    console.error('RAWG getGameDetails error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch game details' });
  }
};

export const getGameScreenshots = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await rawgApi.get(`/games/${id}/screenshots`, { params: { key: process.env.RAWG_API_KEY } });
    res.json(response.data);
  } catch (error) {
    console.error('RAWG getGameScreenshots error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch screenshots' });
  }
};

export const getGenres = async (req, res) => {
  try {
    const response = await rawgApi.get('/genres', { params: { key: process.env.RAWG_API_KEY } });
    res.json(response.data);
  } catch (error) {
    console.error('RAWG getGenres error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
};

export const getPlatforms = async (req, res) => {
  try {
    const response = await rawgApi.get('/platforms', { params: { key: process.env.RAWG_API_KEY } });
    res.json(response.data);
  } catch (error) {
    console.error('RAWG getPlatforms error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch platforms' });
  }
};
