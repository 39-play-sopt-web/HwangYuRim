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

export interface MovieListParams extends MovieRatingParams {
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
