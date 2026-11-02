import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './router/router';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('앱을 표시할 root 요소가 없습니다.');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
