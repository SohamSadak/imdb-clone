import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails, TMDB_IMAGE_BASE_URL } from '../api.js';
// Import our reusable UI components
import Loader from '../components/Loader.jsx'; 
import ErrorMessage from '../components/ErrorMessage.jsx'; 
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the load function so we can call it again if the user clicks "Try Again"
  const loadDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovieDetails(id);
      setMovie(data);
    } catch (err) {
      setError("Failed to load movie details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  // 1. Show Loader centered on the screen
  if (loading) return <div className="details-center"><Loader /></div>;
  
  // 2. Show Error with Retry button
  if (error) return (
    <div className="details-center">
      <ErrorMessage message={error} onRetry={loadDetails} />
      <Link to="/" className="back-button-inline">Go Home</Link>
    </div>
  );

  if (!movie) return null;

  // Format genres safely
  const genres = movie.genres?.map(g => g.name).join(', ');
  const cast = movie.credits?.cast?.slice(0, 5).map(c => c.name).join(', ');

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="details-container">
      <Link to="/" className="back-button">← Back to Home</Link>

      <div 
        className="details-hero"
        style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : {}}
      >
        <div className="hero-overlay">
          <div className="details-content">
            <img 
              src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'https://placehold.co/300x450'} 
              alt={movie.title} 
              className="details-poster"
            />
            <div className="details-info">
              <h1 className="details-title">{movie.title}</h1>
              <p className="details-tagline">{movie.tagline}</p>
              
              <div className="details-meta">
                <span className="rating-badge">⭐ {movie.vote_average.toFixed(1)}</span>
                <span>{movie.release_date?.substring(0, 4)}</span>
                <span>{movie.runtime} min</span>
              </div>

              <div className="details-section">
                <h3>Genre</h3>
                <p>{genres}</p>
              </div>

              <div className="details-section">
                <h3>Plot</h3>
                <p>{movie.overview}</p>
              </div>

              <div className="details-section">
                <h3>Cast</h3>
                <p>{cast}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;