// --- CRUCIAL: PASTE YOUR API KEY HERE ---
const TMDB_API_KEY = 'b2d27697d771c71df3ad6ad975ffa299';
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Helper to handle API requests and errors
 */
async function fetchFromTMDB(endpoint) {
  const url = `${TMDB_API_BASE_URL}/${endpoint}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401) {
         throw new Error('API key is invalid or missing. Please check src/api.js');
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    throw new Error(error.message || 'Failed to fetch movies.');
  }
}

/**
 * Fetches the list of popular movies
 */
export function fetchPopularMovies() {
  return fetchFromTMDB(`movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
}

/**
 * --- NEW FUNCTION ---
 * Fetches movies based on a search query
 * @param {string} query The user's search term
 */
export function fetchSearchMovies(query) {
  // We must encode the query to make it URL-safe
  const encodedQuery = encodeURIComponent(query);
  return fetchFromTMDB(`search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodedQuery}&page=1`);
}