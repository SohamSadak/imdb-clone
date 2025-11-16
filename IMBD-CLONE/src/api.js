
const TMDB_API_KEY = 'b2d27697d771c71df3ad6ad975ffa299';


const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

// Base URL for loading movie poster images
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Fetches the list of popular movies from TMDB
 * @returns {Promise<Array>} A promise that resolves to an array of movie objects
 */
export async function fetchPopularMovies() {
  const url = `${TMDB_API_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

  try {
    const response = await fetch(url);
    
    // Check if the network request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    // The movies are in the 'results' property of the response
    return data.results;

  } catch (error) {
    // Log the error and re-throw it so the component can handle it
    console.error('Failed to fetch popular movies:', error);
    throw new Error('Failed to fetch movies. Please check your API key and network connection.');
  }
}