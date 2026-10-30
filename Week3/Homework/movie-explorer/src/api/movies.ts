import type { MovieDetail, MovieListParams, MovieListResponse } from '../types/movie';
import { apiClient } from './client';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export async function fetchMovies(
  { page = 1, sort_by = 'popularity.desc', ...ratingParams }: MovieListParams = {},
  signal?: AbortSignal,
): Promise<MovieListResponse> {
  const { data } = await apiClient.get<MovieListResponse>('/discover/movie', {
    params: {
      page,
      sort_by,
      ...ratingParams,
    },
    signal,
  });

  return data;
}

export async function fetchMovieDetail(
  movieId: number,
  signal?: AbortSignal,
): Promise<MovieDetail> {
  const { data } = await apiClient.get<MovieDetail>(`/movie/${movieId}`, {
    signal,
  });

  return data;
}

export function getMovieImageUrl(
  path: string | null,
  size: 'w500' | 'original' = 'w500',
): string | null {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}
