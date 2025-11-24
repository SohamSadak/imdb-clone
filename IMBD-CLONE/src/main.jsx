import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App.jsx';
import './index.css';

// This finds the div with id="root" in your index.html and puts your React app inside it
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* We MUST wrap the App in BrowserRouter for the routes to work */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);