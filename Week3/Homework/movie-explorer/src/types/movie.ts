export interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
}

export interface MovieRatingParams {
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
}

export type MovieSort = 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc';

export interface MovieListParams extends MovieRatingParams {
  page?: number;
  sort_by?: MovieSort;
}

export interface MovieSearchParams {
  query: string;
  page?: number;
}

export interface MovieDetail extends Movie {
  original_title: string;
  original_language: string;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  runtime: number | null;
  vote_count: number;
  status: string;
  production_countries: { name: string }[];
  spoken_languages: { iso_639_1: string }[];
  budget: number;
  revenue: number;
}
