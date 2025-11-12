/**
 * Authentication utility functions
 */

/**
 * Clears all authentication-related data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('rememberMe');
};

/**
 * Checks if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

/**
 * Gets the current user from localStorage
 */
export const getCurrentUser = (): { name: string; email: string; role: string } | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Logout handler that clears auth data and navigates to login
 * @param navigate - React Router navigate function
 */
export const handleLogout = (navigate: (path: string) => void): void => {
  clearAuthData();
  navigate('/login');
};

