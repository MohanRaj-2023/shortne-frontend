import {jwtDecode} from 'jwt-decode'

export const isTokenExpired = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      console.warn('⚠️ Token is missing or not a string:', token);
      return true; // Treat as expired
    }
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    console.error('⛔ Failed to decode token:', e.message);
    return true;
  }
};

// export default isTokenExpired;

