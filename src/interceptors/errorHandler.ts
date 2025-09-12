import { AxiosError } from 'axios';
import api from '../services/httpClient';

// Error handler function
const handleError = (error: AxiosError) => {
  // Log the error
  console.error('API call error:', error);

  // Customize error handling based on status code
  if (error.response) {
    switch (error.response.status) {
      case 400:
        console.error('Bad Request:', error.response.data);
        break;
      case 401:
        console.error('Unauthorized:', error.response.data);
        // Optionally redirect to login
        break;
      case 404:
        console.error('Not Found:', error.response.data);
        break;
      case 500:
        console.error('Internal Server Error:', error.response.data);
        break;
      default:
        console.error('Unhandled error:', error.response.data);
    }
  } else if (error.request) {
    console.error('No response received:', error.request);
  } else {
    console.error('Error setting up request:', error.message);
  }

  return Promise.reject(error);
};

// Integrate the error handler with the API instance
api.interceptors.response.use(
  (response) => response,
  (error) => handleError(error)
); 