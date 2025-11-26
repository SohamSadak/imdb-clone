import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// --- 1. THEME CONTEXT ---
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [mode, setMode] = useState('light'); // light or dark

  const toggleTheme = (newTheme) => {
    const nextTheme = newTheme === theme ? (theme === 'dark' ? 'light' : 'dark') : newTheme;
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    const isDarkPreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let newMode;

    if (theme === 'system') {
      newMode = isDarkPreferred ? 'dark' : 'light';
    } else {
      newMode = theme;
    }

    setMode(newMode);

    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// --- 2. FAVORITES CONTEXT (Adapted from previous step) ---
const FavoritesContext = createContext();

const useFavorites = () => useContext(FavoritesContext);

function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('movieFavorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Could not load favorites from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie) => {
    setFavorites((prev) => {
      if (prev.some(m => m.id === movie.id)) return prev;
      const minimalMovie = {
          id: movie.id, 
          title: movie.title, 
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          overview: movie.overview // Added overview for details page demo
      };
      return [...prev, minimalMovie];
    });
  };

  const removeFromFavorites = (movieId) => {
    setFavorites((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isFavorite = (movieId) => {
    return favorites.some((m) => m.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// --- 3. COMPONENTS ---

// Icon for Sun/Light Mode
const SunIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
  </svg>
);

// Icon for Moon/Dark Mode
const MoonIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.752 9.752 0 0011.002 4.25a9.75 9.75 0 1010.75 10.75z" />
  </svg>
);

// Heart Icon
const HeartIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

// Star Icon
const StarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// MovieCard Component (Fully styled and responsive)
function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;

  return (
    <Link to={`/movie/${movie.id}`} className="block relative w-full h-full">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl dark:hover:shadow-red-500/30 ring-2 ring-transparent hover:ring-red-500/50">
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-10 
                      ${favorite 
                        ? 'text-red-500 bg-white/70 dark:bg-gray-900/70 hover:scale-110' 
                        : 'text-white bg-black/50 hover:text-red-400 hover:bg-black/70'}`}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <HeartIcon className="h-5 w-5 fill-current"/>
        </button>

        <img
          src={posterUrl}
          alt={`Poster for ${movie.title}`}
          className="w-full h-auto object-cover aspect-[2/3] group-hover:opacity-90 transition-opacity duration-300"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;
          }}
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate" title={movie.title}>
            {movie.title}
          </h3>
          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
            </p>
            <div className="flex items-center text-gray-900 dark:text-gray-900 bg-yellow-400 font-bold px-2 py-1 rounded-full text-xs">
              <StarIcon className="h-3 w-3 mr-1 fill-current"/>
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Home Page Component
function HomePage({ movies }) {
    const { toggleTheme, mode } = useContext(ThemeContext);

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center pb-8 border-b border-gray-200 dark:border-gray-700 mb-8">
                    <h1 className="text-4xl font-extrabold text-red-600 dark:text-red-500 tracking-tight mb-4 md:mb-0">
                        Movie Explorer
                    </h1>
                    <div className="flex items-center space-x-4">
                        
                        {/* Dark/Light Mode Toggle */}
                        <button
                            onClick={() => toggleTheme(mode === 'dark' ? 'light' : 'dark')}
                            className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                            aria-label="Toggle dark/light mode"
                        >
                            {mode === 'dark' ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>}
                        </button>

                        {/* Favorites Link */}
                        <Link 
                            to="/favorites" 
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-full shadow-lg transition-colors flex items-center text-sm"
                        >
                            <HeartIcon className="h-5 w-5 fill-current mr-2"/>
                            My Favorites
                        </Link>
                    </div>
                </header>

                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                    Trending Now
                </h2>
                
                {/* Responsive Grid Layout for Movie Cards */}
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Favorites Page Component
function FavoritesPage() {
    const { favorites } = useFavorites();

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center pb-8 border-b border-gray-200 dark:border-gray-700 mb-8">
                    <h1 className="text-4xl font-extrabold text-red-600 dark:text-red-500 tracking-tight">
                        My Saved Movies
                    </h1>
                    <Link 
                        to="/" 
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        ← Back to Home
                    </Link>
                </header>

                {favorites.length === 0 ? (
                    <div className="text-center p-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <HeartIcon className="w-12 h-12 text-red-500 mx-auto mb-4"/>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                            It looks lonely here. Start adding movies to your favorites!
                        </p>
                        <Link to="/" className="mt-4 inline-block text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                            Discover Movies
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {favorites.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Movie Details Page Component (Placeholder)
function MovieDetails() {
    const { id } = useParams();
    const { favorites, isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const navigate = useNavigate();
    
    // Attempt to find the movie in favorites (as we don't have a real API fetch)
    const movie = favorites.find(m => m.id === parseInt(id)) || { 
        id: parseInt(id), 
        title: `Movie ID ${id}`, 
        release_date: 'Unknown',
        vote_average: 'N/A',
        overview: "Detailed information about this movie would be loaded here from a server. Since we are using static data/favorites data, this is a placeholder.",
        poster_path: null
    };

    const favorite = isFavorite(movie.id);

    const handleFavoriteClick = () => {
        if (favorite) {
            removeFromFavorites(movie.id);
        } else {
            addToFavorites(movie);
        }
    };

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-8 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors flex items-center"
                >
                    <span className="text-2xl mr-2">←</span> Back
                </button>
                
                <div className="flex flex-col lg:flex-row gap-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
                    {/* Poster Section */}
                    <div className="flex-shrink-0 w-full lg:w-96">
                        <img 
                            src={posterUrl} 
                            alt={`Poster for ${movie.title}`} 
                            className="w-full h-auto object-cover rounded-lg shadow-lg aspect-[2/3]"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`; }}
                        />
                    </div>

                    {/* Details Section */}
                    <div className="flex-grow">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">{movie.title}</h1>
                        
                        <div className="flex items-center space-x-6 mb-6">
                            <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                                Release: {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
                            </span>
                            <div className="flex items-center text-xl text-gray-900 dark:text-gray-900 bg-yellow-400 font-bold px-4 py-1 rounded-full shadow-md">
                                <StarIcon className="h-5 w-5 mr-2 fill-current"/>
                                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                            </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                            {movie.overview}
                        </p>

                        <button
                            onClick={handleFavoriteClick}
                            className={`flex items-center justify-center w-full lg:w-auto px-6 py-3 rounded-full font-bold text-lg transition-colors duration-200 shadow-md 
                                ${favorite 
                                    ? 'bg-red-600 text-white hover:bg-red-700' 
                                    : 'bg-gray-200 text-gray-800 hover:bg-red-500 hover:text-white dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-red-600'}`
                                }
                        >
                            <HeartIcon className={`h-6 w-6 mr-3 ${favorite ? 'fill-white' : 'fill-current'}`}/>
                            {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- 4. MAIN APP COMPONENT ---
export default function App() {
  // Sample static movie data (mimicking an API response)
  const sampleMovies = [
    { id: 1, title: 'Inception', poster_path: '/9gk7adHYeDvHkCKYv5prLdxlSEE.jpg', release_date: '2010-07-16', vote_average: 8.8, overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O." },
    { id: 2, title: 'The Dark Knight', poster_path: '/1hRoyzDtpgXnCKEo3dvuFE4dNYj.jpg', release_date: '2008-07-18', vote_average: 9.0, overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice." },
    { id: 3, title: 'Interstellar', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', release_date: '2014-11-05', vote_average: 8.6, overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
    { id: 4, title: 'Dune: Part Two', poster_path: '/1m1rXopfNDVL3UMiv6kriYxG16j.jpg', release_date: '2024-02-27', vote_average: 8.3, overview: "Paul Atreides unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family." },
    { id: 5, title: 'A Movie With A Very Long Title That Needs Truncation', poster_path: null, release_date: '2025-01-01', vote_average: 7.2, overview: "This movie has an incredibly long title, but the card component handles it gracefully using CSS truncation." },
    { id: 6, title: 'Oppenheimer', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', release_date: '2023-07-19', vote_average: 8.1, overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II." },
    { id: 7, title: 'Parasite', poster_path: '/7IiTTgloJzvGI1TAYymCfkHbSth.jpg', release_date: '2019-05-30', vote_average: 8.5, overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan." },
    { id: 8, title: 'The Matrix', poster_path: '/f89U3ADr1oiB1s91sZzMRL0BpY.jpg', release_date: '1999-03-30', vote_average: 8.7, overview: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is an elaborate deception created by an all-powerful cyber intelligence." },
    { id: 9, title: 'Spirited Away', poster_path: '/39wmItIWnb5lgQd8FESlObb9NtQ.jpg', release_date: '2001-07-20', vote_average: 8.6, overview: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts." },
    { id: 10, title: 'Pulp Fiction', poster_path: '/d5iIlFn5s0ImszBPY82a5Jc8ASV.jpg', release_date: '1994-09-10', vote_average: 8.9, overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption." },
  ];

  return (
    // ThemeProvider controls the dark/light mode class on the HTML tag
    <ThemeProvider>
        {/* FavoritesProvider handles the persistence */}
        <FavoritesProvider>
            <Router>
                {/* Global Background and Text Colors, enabling dark mode */}
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
                    <Routes>
                        <Route path="/" element={<HomePage movies={sampleMovies} />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/movie/:id" element={<MovieDetails />} />
                    </Routes>
                </div>
            </Router>
        </FavoritesProvider>
    </ThemeProvider>
  );
}