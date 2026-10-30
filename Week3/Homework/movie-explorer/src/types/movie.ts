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

export interface MovieDetail extends Movie {
  original_title: string;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  runtime: number | null;
  production_countries: { name: string }[];
}
