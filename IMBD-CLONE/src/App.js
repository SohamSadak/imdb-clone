import React, { useState, useEffect } from 'react';
import './App.css';
// Note: You need to make sure MovieCard is imported from the correct path.
// Based on your files, it might be in 'src/components/MovieCard.jsx'
import MovieCard from './MovieCard.js'; 
import { fetchPopularMovies, fetchSearchMovies } from './api.js';
import useDebounce from './hooks/useDebounce.js';

function App() {
  // State for the list of movies to display
  const [movieList, setMovieList] = useState([]);
  
  // State for loading and errors
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW ---
  // State for the search bar
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for the page title
  const [headerTitle, setHeaderTitle] = useState('Popular Movies');
  
  // Debounce the search query
  // We'll wait 500ms after the user stops typing
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // This effect now runs whenever the *debounced* query changes
  useEffect(() => {
    // Define the async function to load movies
    async function loadMovies() {
      try {
        setIsFetchingData(true);
        setError(null);
        
        let movies;
        
        if (debouncedSearchQuery) {
          // 1. If there's a search query, call fetchSearchMovies
          setHeaderTitle(`Search Results for "${debouncedSearchQuery}"`);
          movies = await fetchSearchMovies(debouncedSearchQuery);
        } else {
          // 2. If the query is empty, show popular movies
          setHeaderTitle('Popular Movies');
          movies = await fetchPopularMovies();
        }
        
        setMovieList(movies);
        
      } catch (err) {
        setError(err.message);
        setMovieList([]); // Clear any old movies
      } finally {
        setIsFetchingData(false); // We are done loading
      }
    }

    loadMovies(); // Call the function
  }, [debouncedSearchQuery]); // Dependency array: only re-run when this value changes

  return (
    <div className="app-container">
      
      {/* --- NEW SEARCH BAR --- */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a movie..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h1 className="app-title">{headerTitle}</h1>

      {/* 1. Show a loading message */}
      {isFetchingData && (
        <p className="app-status-message">Loading movies...</p>
      )}

      {/* 2. Show an error message */}
      {error && (
        <p className="app-error-message">Error: {error}</p>
      )}

      {/* 3. Show the movie grid (if there are movies) */}
      {!isFetchingData && !error && movieList.length > 0 && (
        <div className="movie-grid">
          {movieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
      
      {/* 4. Show "No Results" message (Requirement #3) */}
      {!isFetchingData && !error && movieList.length === 0 && debouncedSearchQuery && (
        <p className="app-status-message">
          No results found for "{debouncedSearchQuery}"
        </p>
      )}
    </div>
  );
}

export default App;