import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://playsopt.o-r.kr/api/v1',
  timeout: 10000,
});
