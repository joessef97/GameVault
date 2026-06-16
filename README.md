# GameVault - Game Discovery Platform

A full-stack game discovery platform built with React, Node.js, Express, MongoDB, and the RAWG API. Features user authentication, game search, advanced filtering, favorites, reviews, ratings, user profiles, and an admin dashboard.

## Tech Stack

### Frontend
- React 18 + Vite
- React Router DOM
- Tailwind CSS
- Lucide React Icons
- React Hot Toast
- Axios

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcryptjs
- RAWG API Integration

## Features

- **User Authentication**: Register/Login with JWT tokens
- **Game Discovery**: Browse trending, top-rated, and upcoming games
- **Advanced Search**: Search with filters (genre, platform, sort order)
- **Game Details**: Detailed game info, screenshots, reviews
- **Favorites**: Save and manage favorite games
- **Reviews & Ratings**: Write reviews and rate games
- **User Profiles**: View and edit profile, see review history
- **Admin Dashboard**: Manage users, reviews, and view statistics
- **Responsive Design**: Works on desktop and mobile
- **Dark Gaming UI**: Modern dark theme with purple accents

## Project Structure

```
game-discovery/
├── server/                 # Backend
│   ├── config/            # Database config
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth & error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── utils/             # Helpers
│   ├── server.js          # Entry point
│   └── package.json
│
└── client/                # Frontend
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # Auth context
    │   ├── pages/         # Page components
    │   ├── services/      # API calls
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── tailwind.config.js
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- RAWG API key (free at https://rawg.io/apidocs)

### 1. Clone & Install

```bash
cd game-discovery

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

**Server** (`server/.env`):
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
RAWG_API_KEY=your_rawg_api_key
NODE_ENV=development
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Production Build

```bash
# Build client
cd client
npm run build

# Start server (serves static files)
cd ../server
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Games (RAWG API Proxy)
- `GET /api/games` - List games with filters
- `GET /api/games/:id` - Game details
- `GET /api/games/:id/screenshots` - Game screenshots
- `GET /api/games/genres` - All genres
- `GET /api/games/platforms` - All platforms

### Favorites
- `GET /api/favorites` - Get user favorites (protected)
- `POST /api/favorites` - Add favorite (protected)
- `DELETE /api/favorites/:gameId` - Remove favorite (protected)
- `GET /api/favorites/check/:gameId` - Check if favorited (protected)

### Reviews
- `GET /api/reviews/game/:gameId` - Get game reviews
- `GET /api/reviews/user/me` - Get my reviews (protected)
- `POST /api/reviews` - Create/update review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)
- `POST /api/reviews/:id/like` - Toggle like (protected)

### Admin (Admin only)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - All users
- `GET /api/admin/reviews` - All reviews
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/reviews/:id` - Delete review
- `PUT /api/admin/users/:id/role` - Update user role

## Screenshots

- Home page with trending games
- Game details with screenshots and reviews
- Search with advanced filters
- User profile with review history
- Admin dashboard with statistics

## License

MIT License
