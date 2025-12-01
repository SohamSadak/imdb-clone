import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { 
    fetchDiscoverMovies, 
    fetchSearchMovies, 
    fetchGenres,
    fetchMovieDetails,
    TMDB_IMAGE_BASE_URL 
} from './api.js';

// --- ICONS ---
const SunIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>;
const MoonIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.752 9.752 0 0011.002 4.25a9.75 9.75 0 1010.75 10.75z" /></svg>;
const HeartIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
const StarIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const FilterIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>;

// --- CONTEXTS ---
const ThemeContext = createContext();
const FavoritesContext = createContext();
const useFavorites = () => useContext(FavoritesContext);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [mode, setMode] = useState('light');

  const toggleTheme = (newTheme) => {
    const nextTheme = newTheme === theme ? (theme === 'dark' ? 'light' : 'dark') : newTheme;
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setMode(isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>{children}</ThemeContext.Provider>;
}

function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('movieFavorites')) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('movieFavorites', JSON.stringify(favorites)); }, [favorites]);

  const addToFavorites = (movie) => {
    setFavorites(prev => prev.some(m => m.id === movie.id) ? prev : [...prev, movie]);
  };
  const removeFromFavorites = (id) => setFavorites(prev => prev.filter(m => m.id !== id));
  const isFavorite = (id) => favorites.some(m => m.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// --- COMPONENTS ---

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); e.stopPropagation();
    favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
  };

  const posterUrl = movie.poster_path 
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` 
    : `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;

  return (
    <Link to={`/movie/${movie.id}`} className="block relative w-full h-full group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-red-500/50">
        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all z-10 
            ${favorite ? 'text-red-500 bg-white/80' : 'text-white bg-black/40 hover:bg-red-500 hover:text-white'}`}
        >
          <HeartIcon className="h-5 w-5 fill-current"/>
        </button>
        <div className="relative aspect-[2/3] overflow-hidden">
            <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm line-clamp-3">{movie.overview}</p>
            </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{movie.title}</h3>
          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="text-gray-500 dark:text-gray-400">{movie.release_date?.substring(0, 4) || 'N/A'}</p>
            <div className="flex items-center text-amber-500 font-bold bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">
              <StarIcon className="h-3.5 w-3.5 mr-1 fill-current"/>
              {movie.vote_average?.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// --- HOME PAGE (With Real Filtering) ---
function HomePage() {
    const { toggleTheme, mode } = useContext(ThemeContext);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [genreList, setGenreList] = useState([]);
    
    // Filters State
    const [filters, setFilters] = useState({
        genreId: '',
        year: '',
        sortBy: 'popularity.desc'
    });

    // Load Genres on Mount
    useEffect(() => {
        fetchGenres().then(setGenreList).catch(console.error);
    }, []);

    // Main Data Fetcher
    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                let data;
                if (searchQuery.trim()) {
                    data = await fetchSearchMovies(searchQuery);
                } else {
                    data = await fetchDiscoverMovies(filters);
                }
                setMovies(data.results || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(loadMovies, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, filters]);

    // Handlers
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        // If user filters, clear search query to avoid confusion
        if (searchQuery) setSearchQuery(''); 
    };

    // Generate years for dropdown
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 50}, (_, i) => currentYear - i);

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 tracking-tighter">
                    MovieExplorer
                </h1>
                <div className="flex items-center gap-3">
                    <button onClick={() => toggleTheme(mode === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        {mode === 'dark' ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>}
                    </button>
                    <Link to="/favorites" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-red-500/20">
                        <HeartIcon className="w-5 h-5 fill-current"/> Favorites
                    </Link>
                </div>
            </header>

            {/* Controls Section */}
            <section className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search by title..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all dark:text-white"
                    />
                    <svg className="w-6 h-6 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    
                    {/* Genre Filter */}
                    <div className="relative">
                        <select 
                            value={filters.genreId}
                            onChange={(e) => handleFilterChange('genreId', e.target.value)}
                            className="w-full appearance-none px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
                        >
                            <option value="">All Genres</option>
                            {genreList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                        <FilterIcon className="w-5 h-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none"/>
                    </div>

                    {/* Year Filter */}
                    <div className="relative">
                        <select 
                            value={filters.year}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="w-full appearance-none px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
                        >
                            <option value="">Any Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <svg className="w-5 h-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>

                    {/* Sort Filter */}
                    <div className="relative">
                        <select 
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="w-full appearance-none px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
                        >
                            <option value="popularity.desc">Most Popular</option>
                            <option value="vote_average.desc">Highest Rated</option>
                            <option value="primary_release_date.desc">Newest Releases</option>
                            <option value="revenue.desc">Highest Revenue</option>
                        </select>
                        <svg className="w-5 h-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
                    </div>
                </div>
            </section>

            {/* Results Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
                </div>
            ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">No movies found matching your criteria.</p>
                    <button onClick={() => {setSearchQuery(''); setFilters({genreId:'', year:'', sortBy:'popularity.desc'})}} className="mt-4 text-red-500 hover:underline">Clear all filters</button>
                </div>
            )}
        </div>
    );
}

// --- FAVORITES PAGE ---
function FavoritesPage() {
    const { favorites } = useFavorites();
    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Collection</h1>
                <Link to="/" className="text-gray-500 hover:text-red-500 transition-colors">← Back to Discover</Link>
            </header>
            {favorites.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                    <p className="text-xl text-gray-500">Your favorites list is empty.</p>
                    <Link to="/" className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors">Start Browsing</Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {favorites.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
            )}
        </div>
    );
}

// --- MOVIE DETAILS PAGE ---
function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

    useEffect(() => {
        fetchMovieDetails(id)
            .then(setMovie)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div></div>;
    if (!movie) return <div className="min-h-screen flex justify-center items-center">Movie not found</div>;

    const favorite = isFavorite(movie.id);
    const posterUrl = movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` 
        : `https://placehold.co/500x750/333/999?text=${encodeURIComponent(movie.title)}`;

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-8 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors flex items-center">
                    <span className="text-2xl mr-2">←</span> Back
                </button>
                <div className="flex flex-col lg:flex-row gap-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
                    <div className="flex-shrink-0 w-full lg:w-96">
                        <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover rounded-lg shadow-lg aspect-[2/3]" />
                    </div>
                    <div className="flex-grow">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">{movie.title}</h1>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">{movie.overview}</p>
                        <button onClick={() => favorite ? removeFromFavorites(movie.id) : addToFavorites(movie)} className={`flex items-center justify-center w-full lg:w-auto px-6 py-3 rounded-full font-bold text-lg transition-colors duration-200 shadow-md ${favorite ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                            <HeartIcon className={`h-6 w-6 mr-3 ${favorite ? 'fill-white' : 'fill-current'}`}/> {favorite ? 'Remove' : 'Add to Favorites'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- MAIN APP ---
export default function App() {
  return (
    <ThemeProvider>
        <FavoritesProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/movie/:id" element={<MovieDetails />} />
                    </Routes>
                </div>
            </Router>
        </FavoritesProvider>
    </ThemeProvider>
  );
}