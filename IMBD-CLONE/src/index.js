import React from 'react';
import ReactDOM from 'react-dom/client';
// Import the AuthProvider we created for Firebase
import { AuthProvider } from './contexts/AuthContext'; 
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the App in AuthProvider so user data is available everywhere */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);