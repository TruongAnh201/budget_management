import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Thay đổi thành URL API của bạn
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000 // Giới hạn thời gian request (5s)
});

export default apiClient;