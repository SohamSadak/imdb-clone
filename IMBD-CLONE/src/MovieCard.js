import React from 'react';
import './MovieCard.css';
// Import the base URL for images from our new api.js file
import { TMDB_IMAGE_BASE_URL } from './api';

function MovieCard({ movie }) {
  
  // --- New Image Logic ---
  // The API gives us a 'poster_path', e.g., "/1m1rXopfNDVL3UMiv6kriYxG16j.jpg"
  // We build the full URL by combining it with the base URL
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;
  
  return (
    <div className="movie-card">
      <img
        src={posterUrl}
        alt={`Poster for ${movie.title}`}
        className="movie-poster"
        // Add an error handler in case the API image link is broken
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;
        }}
      />
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>
          {movie.title}
        </h3>
        <div className="movie-details">
          <p className="movie-year">
            {/* The API gives a full date 'YYYY-MM-DD', so we split it. */}
            {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
          </p>
          <div className="movie-rating">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="star-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* The API gives 'vote_average' */}
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;