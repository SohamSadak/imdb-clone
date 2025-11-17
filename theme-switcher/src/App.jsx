import React from "react";
import { useTheme } from "./ThemeContext.jsx";
import "./App.css";

const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container">
      <div className="theme-card">
        <h1>Theme Switcher</h1>
        <p>Toggle between Light and Dark Mode</p>

        <div className="toggle-wrapper" onClick={toggleTheme}>
          <span className="icon">🌞</span>

          <div className={`switch ${theme}`}>
            <div className="switch-circle"></div>
          </div>

          <span className="icon">🌜</span>
        </div>
      </div>
    </div>
  );
};

export default App;
