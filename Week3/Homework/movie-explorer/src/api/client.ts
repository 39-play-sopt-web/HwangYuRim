import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export const apiClient = axios.create({
  baseURL,
  params: {
    api_key: apiKey,
    language: 'ko-KR',
    region: 'KR',
  },
});

apiClient.interceptors.request.use((config) => {
  if (!baseURL?.trim() || !apiKey?.trim()) {
    throw new Error(
      '.env에 VITE_API_BASE_URL과 VITE_API_KEY를 입력한 뒤 개발 서버를 재시작해주세요.',
    );
  }

  return config;
});
