import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { Outlet, useMatch } from 'react-router';
import styled from 'styled-components';
import { fetchMovies } from '../api/movies';
import MovieCard from '../components/MovieCard';
import RatingFilter from '../components/RatingFilter';
import { RATING_FILTERS } from '../constants/ratingFilters';
import type { RatingFilterOption } from '../constants/ratingFilters';
import type { Movie } from '../types/movie';

const MAX_TMDB_PAGE = 500;

export default function MovieListPage() {
  const isListPage = useMatch('/') !== null;
  const [selectedFilter, setSelectedFilter] = useState(RATING_FILTERS[0]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isRequestInFlight = useRef(false);
  const completedRequest = useRef<string | null>(null);
  const scrollPosition = useRef(0);

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    function saveScrollPosition() {
      scrollPosition.current = window.scrollY;
    }

    if (isListPage) {
      window.scrollTo(0, scrollPosition.current);
      window.addEventListener('scroll', saveScrollPosition, { passive: true });
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      window.removeEventListener('scroll', saveScrollPosition);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [isListPage]);

  useEffect(() => {
    const requestKey = `${selectedFilter.value}:${page}`;
    if (!isListPage || completedRequest.current === requestKey) return;

    const controller = new AbortController();
    isRequestInFlight.current = true;

    fetchMovies({ page, ...selectedFilter.params }, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          completedRequest.current = requestKey;
          setMovies((previousMovies) => {
            const seenIds = new Set<number>();

            return [...previousMovies, ...data.results].filter((movie) => {
              if (seenIds.has(movie.id)) return false;

              seenIds.add(movie.id);
              return true;
            });
          });
          setHasMore(
            data.results.length > 0 && data.page < Math.min(data.total_pages, MAX_TMDB_PAGE),
          );
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          completedRequest.current = requestKey;
          setError(
            error instanceof Error && !isAxiosError(error)
              ? error.message
              : '영화 목록을 불러오지 못했어요. 연결 상태를 확인한 뒤 새로고침해주세요.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          isRequestInFlight.current = false;
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
      isRequestInFlight.current = false;
    };
  }, [selectedFilter, page, isListPage]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!isListPage || !target || isLoading || !hasMore || error) return;

    let isObserving = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!isObserving || !entries[0]?.isIntersecting || isRequestInFlight.current) return;

        isRequestInFlight.current = true;
        setIsLoading(true);
        setPage((previousPage) => previousPage + 1);
      },
      { rootMargin: '200px' },
    );

    observer.observe(target);

    return () => {
      isObserving = false;
      observer.disconnect();
    };
  }, [isListPage, isLoading, hasMore, error]);

  function handleFilterChange(filter: RatingFilterOption) {
    if (filter.value === selectedFilter.value) return;

    isRequestInFlight.current = true;
    completedRequest.current = null;
    setSelectedFilter(filter);
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }

  return (
    <>
      {/* 상세 화면에서는 숨겨서 목록 상태와 카드의 이미지 상태를 유지한다. */}
      <section hidden={!isListPage} aria-labelledby="movie-list-title" aria-busy={isLoading}>
        <h1 id="movie-list-title">영화 목록</h1>
        <Description>인기순으로 영화를 둘러보세요.</Description>
        <RatingFilter
          selectedValue={selectedFilter.value}
          onChange={handleFilterChange}
        />

        {movies.length > 0 && (
          <MovieGrid>
            {movies.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} />
              </li>
            ))}
          </MovieGrid>
        )}

        {isLoading && (
          <StatusMessage role="status">
            {page === 1 ? '영화 목록을 불러오는 중이에요.' : '다음 페이지를 불러오는 중이에요.'}
          </StatusMessage>
        )}
        {error && <StatusMessage role="alert">{error}</StatusMessage>}
        {!isLoading && !error && movies.length === 0 && (
          <StatusMessage role="status">조건에 맞는 영화가 없습니다.</StatusMessage>
        )}
        {!isLoading && !error && movies.length > 0 && !hasMore && (
          <StatusMessage role="status">마지막 영화까지 모두 확인했어요.</StatusMessage>
        )}
        <LoadMoreTarget ref={loadMoreRef} aria-hidden="true" />
      </section>
      <Outlet />
    </>
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

const StatusMessage = styled.p`
  margin: 24px 0;
`;

const LoadMoreTarget = styled.div`
  height: 1px;
`;
