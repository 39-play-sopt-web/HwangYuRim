import { createBrowserRouter } from 'react-router';
import App from '../App';
import MovieDetailPage from '../pages/MovieDetailPage';
import MovieListPage from '../pages/MovieListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '',
        Component: MovieListPage,
        children: [
          { path: 'movies/:movieId', Component: MovieDetailPage },
        ],
      },
    ],
  },
]);
