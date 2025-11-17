import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce a value.
 * @param {*} value The value to debounce (e.g., a search query)
 * @param {number} delay The delay in milliseconds
 * @returns {*} The debounced value
 */
function useDebounce(value, delay) {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // This is the cleanup function:
    // It clears the timeout if the 'value' or 'delay' changes
    // *before* the timeout has finished.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
}

export default useDebounce;