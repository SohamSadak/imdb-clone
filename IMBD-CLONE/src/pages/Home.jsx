import React, { useState, useEffect, useCallback } from 'react';
// Import our new UI components
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import MovieCard from '../components/MovieCard.jsx'; 

import { fetchPopularMovies, fetchSearchMovies } from '../api.js';
import useDebounce from '../hooks/useDebounce.js';
import '../App.css'; 

function Home() {
  const [movieList, setMovieList] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [headerTitle, setHeaderTitle] = useState('Popular Movies');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Define fetch logic as a reusable function for "Retry" capability
  const fetchMovies = useCallback(async (resetPage = true) => {
    try {
      setIsFetchingData(true);
      setError(null);
      
      const currentPage = resetPage ? 1 : page;
      if (resetPage) setPage(1);

      let data;
      if (debouncedSearchQuery) {
        setHeaderTitle(`Search Results for "${debouncedSearchQuery}"`);
        data = await fetchSearchMovies(debouncedSearchQuery, currentPage);
      } else {
        setHeaderTitle('Popular Movies');
        data = await fetchPopularMovies(currentPage);
      }
      
      setMovieList(data.results);
      setTotalPages(data.totalPages);
      
    } catch (err) {
      setError(err.message || "Failed to fetch movies. Please check your internet connection.");
      setMovieList([]);
    } finally {
      setIsFetchingData(false);
    }
  }, [debouncedSearchQuery]); 

  // Initial Fetch
  useEffect(() => {
    fetchMovies(true);
  }, [fetchMovies]);


  // Load More Logic
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    try {
      setIsLoadingMore(true);
      let data;
      if (debouncedSearchQuery) {
        data = await fetchSearchMovies(debouncedSearchQuery, nextPage);
      } else {
        data = await fetchPopularMovies(nextPage);
      }
      setMovieList((prevMovies) => [...prevMovies, ...data.results]);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load more pages");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="app-container">
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

      {/* 1. Loading State */}
      {isFetchingData && <Loader />}

      {/* 2. Error State with Retry Button */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => fetchMovies(true)} 
        />
      )}

      {/* 3. Data State */}
      {!isFetchingData && !error && movieList.length > 0 && (
        <>
          <div className="movie-grid">
            {movieList.map((movie, index) => (
              <MovieCard key={`${movie.id}-${index}`} movie={movie} />
            ))}
          </div>

          {page < totalPages && (
            <div className="load-more-container">
              <button 
                className="load-more-btn" 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {/* Small spinner inside button */}
                {isLoadingMore ? <span className="spinner-small"></span> : 'Load More Movies'}
              </button>
            </div>
          )}
        </>
      )}
      
      {/* 4. Empty State (No Results) */}
      {!isFetchingData && !error && movieList.length === 0 && debouncedSearchQuery && (
        <div className="empty-state">
            <p className="app-status-message">No results found for "{debouncedSearchQuery}"</p>
            <button className="retry-button" onClick={() => setSearchQuery('')}>Clear Search</button>
        </div>
      )}
    </div>
  );
}

export default Home;