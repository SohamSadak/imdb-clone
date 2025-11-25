import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

// Custom hook to use the context easily in other components
export function useFavorites() {
  return useContext(FavoritesContext);
}

// The Provider component that wraps your app and manages localStorage
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    // Load from local storage on initial render
    try {
      const saved = localStorage.getItem('movieFavorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Could not load favorites:", error);
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
      return [...prev, movie];
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