import React, { useState, useEffect } from 'react';
// Note: Adjusted path to go up one level to find components
import MovieCard from '../components/MovieCard.jsx';
import { fetchPopularMovies, fetchSearchMovies } from '../api.js';
import useDebounce from '../hooks/useDebounce.js';
import '../App.css'; // Keep using App.css for shared styles

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
  
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setIsFetchingData(true);
        setError(null);
        setPage(1);

        let data;
        if (debouncedSearchQuery) {
          setHeaderTitle(`Search Results for "${debouncedSearchQuery}"`);
          data = await fetchSearchMovies(debouncedSearchQuery, 1);
        } else {
          setHeaderTitle('Popular Movies');
          data = await fetchPopularMovies(1);
        }
        
        setMovieList(data.results);
        setTotalPages(data.totalPages);
        
      } catch (err) {
        setError(err.message);
        setMovieList([]);
      } finally {
        setIsFetchingData(false);
      }
    }

    fetchInitialData();
  }, [debouncedSearchQuery]);

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
      setError("Failed to load more movies.");
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

      {isFetchingData && <p className="app-status-message">Loading movies...</p>}
      {error && <p className="app-error-message">Error: {error}</p>}

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
                {isLoadingMore ? 'Loading...' : 'Load More Movies'}
              </button>
            </div>
          )}
        </>
      )}
      
      {!isFetchingData && !error && movieList.length === 0 && debouncedSearchQuery && (
        <p className="app-status-message">No results found for "{debouncedSearchQuery}"</p>
      )}
    </div>
  );
}

export default Home;