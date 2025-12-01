// --- CRUCIAL: PASTE YOUR API KEY HERE ---
const TMDB_API_KEY = 'b2d27697d771c71df3ad6ad975ffa299';
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Helper to handle API requests and errors
 */
async function fetchFromTMDB(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    ...params
  });

  const url = `${TMDB_API_BASE_URL}/${endpoint}?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return {
      results: data.results || [],
      totalPages: data.total_pages || 0
    };
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    throw new Error(error.message || 'Failed to fetch movies.');
  }
}

/**
 * Fetches the list of official movie genres
 */
export async function fetchGenres() {
  const url = `${TMDB_API_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;
  const response = await fetch(url);
  const data = await response.json();
  return data.genres || [];
}

/**
 * Advanced Discover/Filter Search
 * @param {Object} filters - { genreId, year, sortBy, page }
 */
export function fetchDiscoverMovies(filters = {}) {
  const { genreId, year, sortBy, page = 1 } = filters;
  
  const params = {
    page,
    sort_by: sortBy || 'popularity.desc',
    include_adult: false,
    include_video: false,
  };

  if (genreId) params.with_genres = genreId;
  if (year) params.primary_release_year = year;

  return fetchFromTMDB('discover/movie', params);
}

export function fetchSearchMovies(query, page = 1) {
  return fetchFromTMDB('search/movie', { query, page });
}

export function fetchMovieDetails(movieId) {
  return fetchFromTMDB(`movie/${movieId}`, { append_to_response: 'credits' })
    .then(data => data.results || data); 
}

// Fallback for popular (uses discover with default sort)
export function fetchPopularMovies(page = 1) {
  return fetchDiscoverMovies({ sortBy: 'popularity.desc', page });
}