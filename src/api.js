import axios from 'axios';

// Create an instance of axios with the base URL
const api = axios.create({
  //baseURL: "https://portpoliosid.onrender.com"
  baseURL: "https://my-portfolio-306678715125.us-central1.run.app"
});

// Export the Axios instance
export default api;
