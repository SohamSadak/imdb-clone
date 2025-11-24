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
    
    // --- UPDATED RETURN ---
    // We now return an object with both the movie list AND total pages
    return {
      results: data.results,
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    throw new Error(error.message || 'Failed to fetch movies.');
  }
}

/**
 * Fetches the list of popular movies (Updated for Pagination)
 */
export function fetchPopularMovies(page = 1) {
  return fetchFromTMDB(`movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`);
}

/**
 * Fetches movies based on a search query (Updated for Pagination)
 */
export function fetchSearchMovies(query, page = 1) {
  const encodedQuery = encodeURIComponent(query);
  return fetchFromTMDB(`search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodedQuery}&page=${page}`);
}

// ... existing imports and functions ...

/**
 * Fetches detailed info for a single movie, including cast
 * @param {number} movieId The ID of the movie
 */
export async function fetchMovieDetails(movieId) {
  // append_to_response=credits lets us get cast info in the same call
  return fetchFromTMDB(`movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits`);
}