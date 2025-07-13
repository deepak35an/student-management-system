// src/services/axiosInstance.jsx
import axios from "axios";

// Setup a base Axios instance with .env support
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
