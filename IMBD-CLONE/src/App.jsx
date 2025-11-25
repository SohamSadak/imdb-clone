import React, { useState, useEffect, createContext, useContext } from 'react';
// FIX: Added .jsx extension to resolve file path errors
import Home from './pages/Home.jsx'; 
import MovieDetails from './pages/MovieDetails.jsx'; 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// --- Favorites Context Setup (INLINE) ---
// We move the context logic here so the provider can wrap the entire app.
const FavoritesContext = createContext();

// Custom hook to use the context easily
export const useFavorites = () => useContext(FavoritesContext);

// The Provider component that wraps your app and manages localStorage
function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    // Load from local storage on initial render
    try {
      const saved = localStorage.getItem('movieFavorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Could not load favorites from localStorage:", error);
      return [];
    }
  });

  // Save to local storage whenever favorites change
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Function to add a movie
  const addToFavorites = (movie) => {
    setFavorites((prev) => {
      // Prevent adding duplicates
      if (prev.some(m => m.id === movie.id)) return prev;
      // Store minimal required info (id, title, poster, etc.)
      const minimalMovie = {
          id: movie.id, 
          title: movie.title, 
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average 
      };
      return [...prev, minimalMovie];
    });
  };

  // Function to remove a movie
  const removeFromFavorites = (movieId) => {
    setFavorites((prev) => prev.filter((m) => m.id !== movieId));
  };

  // Function to check if a movie is already favorited
  const isFavorite = (movieId) => {
    return favorites.some((m) => m.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
// --- END Favorites Context Setup ---


// Temporary component to display favorites (we will make this better later)
function FavoritesList() {
    const { favorites } = useFavorites();
    
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Your Favorites ({favorites.length})</h2>
            <div className="space-y-2">
                {favorites.map(movie => (
                    <div key={movie.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow flex justify-between items-center">
                        {/* Note: In a real app, this should link to the MovieDetails component */}
                        <Link to={`/movie/${movie.id}`} className="text-blue-500 hover:underline">{movie.title}</Link>
                        <p className="text-sm text-gray-500">{movie.release_date}</p>
                    </div>
                ))}
            </div>
            {favorites.length === 0 && (
                <p className="text-gray-500 mt-4">No favorites added yet. Go back to Home to find some movies!</p>
            )}
        </div>
    );
}


export default function App() {
  return (
    // FavoritesProvider wraps the entire routing structure
    <FavoritesProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
          {/* Example Nav - You should integrate this into your existing Navbar/Header */}
          <nav className="p-4 bg-gray-800 dark:bg-gray-900 shadow-md">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                  <Link to="/" className="text-2xl font-bold text-red-500">IMDb CLONE</Link>
                  <div className="space-x-4">
                      <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
                      <Link to="/favorites" className="hover:text-red-400 transition-colors">Favorites</Link>
                  </div>
              </div>
          </nav>
          
          <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/favorites" element={<FavoritesList />} /> 
            </Routes>
          </main>
        </div>
      </Router>
    </FavoritesProvider>
  );
}