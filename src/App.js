import React from 'react';
import './App.css';
import MovieCard from './MovieCard';

import inceptionPoster from './assets/inception.jpg';
import darkKnightPoster from './assets/dark-knight.jpg';
import interstellarPoster from './assets/interstellar.jpg';
import dune2Poster from './assets/dune-2.jpg';

function App() {

  const sampleMovies = [
    {
      id: 1,
      title: 'Inception',
      poster: inceptionPoster,
      release_date: '2010-07-16',
      vote_average: 8.8,
    },
    {
      id: 2,
      title: 'The Dark Knight',
      poster: darkKnightPoster,
      release_date: '2008-07-18',
      vote_average: 9.0,
    },
    {
      id: 3,
      title: 'Interstellar',
      poster: interstellarPoster,
      release_date: '2014-11-05',
      vote_average: 8.6,
    },
    {
      id: 4,
      title: 'Dune: Part Two',
      poster: dune2Poster, 
      release_date: '2024-02-27',
      vote_average: 8.3,
    },
     {
      id: 5,
      title: 'A Movie With No Poster',
      poster: null,
      release_date: '2025-01-01',
      vote_average: 7.2,
    },
  ];

  return (
    <div className="app-container">
      <h1 className="app-title">
        Featured Movies
      </h1>
      
      <div className="movie-grid">
        {sampleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default App;