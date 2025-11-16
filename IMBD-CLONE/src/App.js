import React, { useState, useEffect } from 'react';
import './App.css';
import MovieCard from './MovieCard';
import { fetchPopularMovies } from './api'; // Import our new API function

function App() {
  // --- State Hooks ---
  // We use state to store data that changes over time.
  
  // 'movies' will hold our list of movies from the API
  // It starts as an empty array.
  const [movies, setMovies] = useState([]);
  
  // 'isLoading' will show a loading message while we fetch data
  // It starts as true because we begin loading immediately.
  const [isLoading, setIsLoading] = useState(true);
  
  // 'error' will hold any error message if the API call fails
  // It starts as null because there is no error yet.
  const [error, setError] = useState(null);

  // --- Effect Hook ---
  // This useEffect hook runs once when the component first mounts
  // (thanks to the empty dependency array [] at the end).
  // It's the perfect place to fetch initial data.
  // 
  useEffect(() => {
    // We define an async function inside the effect
    async function loadMovies() {
      try {
        // 1. Tell the app we are starting to load
        setIsLoading(true); 
        
        // 2. Call our API function and wait for the results
        const popularMovies = await fetchPopularMovies();
        
        // 3. Store the movies in our state
        setMovies(popularMovies); 
        
        // 4. Clear any previous errors
        setError(null); 
      } catch (err) {
        // 5. If the fetch fails, store the error message
        setError(err.message);
        setMovies([]); // Clear any old movie data
      } finally {
        // 6. This runs whether the fetch succeeded or failed
        setIsLoading(false); // We are done loading
      }
    }

    // Call the function to start the fetch
    loadMovies(); 
    
  }, []); // The empty array [] means "run this effect only once on mount"

  // --- Render Logic ---
  // Now we decide what to show based on our state
  
  // 1. Show a loading message
  if (isLoading) {
    return (
      <div className="app-container">
        <h1 className="app-title">Loading Movies...</h1>
      </div>
    );
  }

  // 2. Show an error message if something went wrong
  if (error) {
    return (
      <div className="app-container">
        <h1 className="app-title" style={{ color: 'red' }}>
          Error: {error}
        </h1>
        <p style={{ textAlign: 'center' }}>
          Please make sure you have entered your API key in `src/api.js`.
        </p>
      </div>
    );
  }

  // 3. Show the movies if everything is successful
  return (
    <div className="app-container">
      <h1 className="app-title">Popular Movies</h1>
      <div className="movie-grid">
        {/* We map over the 'movies' array from our state.
          For each 'movie' object in the array, we render a MovieCard.
        */}
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default App;