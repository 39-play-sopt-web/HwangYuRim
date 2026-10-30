import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import styled from 'styled-components';
import { fetchMovies } from '../api/movies';
import MovieCard from '../components/MovieCard';
import RatingFilter from '../components/RatingFilter';
import { RATING_FILTERS } from '../constants/ratingFilters';
import type { RatingFilterOption } from '../constants/ratingFilters';
import type { Movie } from '../types/movie';

export default function MovieListPage() {
  const [selectedFilter, setSelectedFilter] = useState(RATING_FILTERS[0]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchMovies({ page: 1, ...selectedFilter.params }, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setMovies(data.results);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error && !isAxiosError(error)
              ? error.message
              : '영화 목록을 불러오지 못했어요. 연결 상태를 확인한 뒤 새로고침해주세요.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [selectedFilter]);

  function handleFilterChange(filter: RatingFilterOption) {
    if (filter.value === selectedFilter.value) return;

    setSelectedFilter(filter);
    setMovies([]);
    setError(null);
    setIsLoading(true);
  }

  return (
    <section aria-labelledby="movie-list-title" aria-busy={isLoading}>
      <h1 id="movie-list-title">영화 목록</h1>
      <Description>인기순으로 영화를 둘러보세요.</Description>
      <RatingFilter
        selectedValue={selectedFilter.value}
        onChange={handleFilterChange}
      />

      {isLoading ? (
        <p role="status">영화 목록을 불러오는 중이에요.</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : movies.length === 0 ? (
        <p role="status">조건에 맞는 영화가 없습니다.</p>
      ) : (
        <MovieGrid>
          {movies.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} />
            </li>
          ))}
        </MovieGrid>
      )}
    </section>
  );
}

const Description = styled.p`
  margin: 0 0 32px;
`;

const MovieGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
`;
