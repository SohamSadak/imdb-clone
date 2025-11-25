import React from 'react';
import PropTypes from 'prop-types'; 
// Import useFavorites from the sibling file App.jsx (which defines it)
import { useFavorites } from './App'; 
import './MovieCard.css';
import { TMDB_IMAGE_BASE_URL } from './api';
import { Link } from 'react-router-dom'; // Assuming you want the whole card clickable via React Router

function MovieCard({ movie }) {
  // Use the favorites hook
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    // Prevent the click from navigating to the movie details page
    e.preventDefault(); 
    e.stopPropagation();
    
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      // Pass the necessary movie data to the context
      addToFavorites(movie);
    }
  };
  
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;
  
  return (
    // Wrap the card content in a Link to navigate to details
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <div className="movie-card">
          
          {/* Favorite Button */}
          <button 
              className={`favorite-button ${favorite ? 'favorite' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
              {/* Heart SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="heart-icon" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
          </button>

          <img
            src={posterUrl}
            alt={`Poster for ${movie.title}`}
            className="movie-poster"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;
            }}
          />
          <div className="movie-info">
            <h3 className="movie-title" title={movie.title}>
              {movie.title}
            </h3>
            <div className="movie-details">
              <p className="movie-year">
                {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
              </p>
              <div className="movie-rating">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="star-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
    </Link>
  );
}

// --- Suggestion #4: Add PropTypes definition ---
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number,
  }).isRequired, 
};

export default MovieCard;