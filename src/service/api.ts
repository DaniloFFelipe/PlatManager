import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.81.18.139:3333',
});

export default api;
