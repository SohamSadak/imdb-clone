import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';          // Contains the code you pasted
import MovieDetails from './pages/MovieDetails.jsx'; // The new details page
import './App.css';

function App() {
  return (
    <Routes>
      {/* The Home Page (Search + List + Pagination) */}
      <Route path="/" element={<Home />} />
      
      {/* The Details Page (Dynamic ID) */}
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  );
}

export default App;