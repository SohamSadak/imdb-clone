import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails, TMDB_IMAGE_BASE_URL } from '../api.js';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams(); // Get the ID from the URL (e.g., /movie/550)
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id]);

  if (loading) return <div className="details-loading">Loading Movie Details...</div>;
  if (error) return <div className="details-error">{error}</div>;
  if (!movie) return null;

  // Format genres as a string
  const genres = movie.genres?.map(g => g.name).join(', ');
  
  // Get top 5 cast members
  const cast = movie.credits?.cast?.slice(0, 5).map(c => c.name).join(', ');

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="details-container">
      {/* Back Button */}
      <Link to="/" className="back-button">← Back to Home</Link>

      {/* Hero Section with Backdrop */}
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