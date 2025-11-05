import axios from 'axios';

const baseURL =
  process.env.REACT_APP_API_BASE ||
  'http://localhost:3000';

const client = axios.create({ baseURL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
