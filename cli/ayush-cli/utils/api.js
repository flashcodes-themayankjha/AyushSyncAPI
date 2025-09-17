
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.26.95.153:8080/api',
});

export default api;
