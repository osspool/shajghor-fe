/**
 * A utility module for handling localStorage operations with error handling and SSR safety
 */

/**
 * Gets an item from localStorage with parsing
 * @param {string} key - The key to retrieve from localStorage
 * @param {any} defaultValue - Default value to return if key doesn't exist or on error
 * @returns {any} The parsed value or defaultValue
 */
export const getStorageItem = (key, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Sets an item in localStorage with serialization
 * @param {string} key - The key to set in localStorage
 * @param {any} value - The value to serialize and store
 * @returns {boolean} Success status
 */
export const setStorageItem = (key, value) => {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Removes an item from localStorage
 * @param {string} key - The key to remove from localStorage
 * @returns {boolean} Success status
 */
export const removeStorageItem = (key) => {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clears all items from localStorage
 * @returns {boolean} Success status
 */
export const clearStorage = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Checks if localStorage is empty for a specific key
 * @param {string} key - The key to check in localStorage
 * @returns {boolean} True if empty or doesn't exist
 */
export const isStorageEmpty = (key) => {
  const data = getStorageItem(key);
  return !data || (Array.isArray(data) && data.length === 0);
};

/**
 * Generates a UUID (v4)
 * @returns {string} A random UUID
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Shorthand object for all localStorage operations
 */
export const storage = {
  get: getStorageItem,
  set: setStorageItem,
  remove: removeStorageItem,
  clear: clearStorage,
  isEmpty: isStorageEmpty,
  generateUUID
};

export default storage; 