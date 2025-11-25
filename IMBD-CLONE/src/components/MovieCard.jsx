import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // Import Link
import './MovieCard.css';
import { TMDB_IMAGE_BASE_URL } from '../api';

function MovieCard({ movie }) {
  
  // Construct the full URL for the poster image
  // If poster_path is null, fall back to the placeholder immediately
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;
  
  return (
    // Wrap the card in a Link. Clicking it takes you to /movie/{id}
    // We add 'movie-card-link' class to remove default link styles (like underlines)
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <img
          src={posterUrl}
          alt={`Poster for ${movie.title}`}
          className="movie-poster"
          // Handle cases where the image URL exists but fails to load (404)
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;
          }}
        />
        <div className="movie-info">
          {/* Title with hover tooltip */}
          <h3 className="movie-title" title={movie.title}>
            {movie.title}
          </h3>
          <div className="movie-details">
            <p className="movie-year">
              {/* Extract just the year from YYYY-MM-DD */}
              {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
            </p>
            <div className="movie-rating">
              {/* Star Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="star-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {/* Rating formatted to 1 decimal place */}
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Define the expected shape of the 'movie' prop for safety
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