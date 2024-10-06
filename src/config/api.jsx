import axios from 'axios';

console.log('process.env.REACT_APP_SERVER_BASE_URL', import.meta.env.VITE_API_BASE_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default instance;