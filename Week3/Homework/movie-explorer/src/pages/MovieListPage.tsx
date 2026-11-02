import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { Outlet, useMatch } from 'react-router';
import styled from 'styled-components';
import { fetchMovies, searchMovies } from '../api/movies';
import MovieCard from '../components/MovieCard';
import MovieSearch from '../components/MovieSearch';
import RatingFilter from '../components/RatingFilter';
import { RATING_FILTERS } from '../constants/ratingFilters';
import type { RatingFilterOption } from '../constants/ratingFilters';
import type { Movie, MovieSort } from '../types/movie';

const MAX_TMDB_PAGE = 500;
const SORT_OPTIONS: { value: MovieSort; label: string }[] = [
  { value: 'popularity.desc', label: '인기순' },
  { value: 'vote_average.desc', label: '평점순' },
  { value: 'primary_release_date.desc', label: '최신 개봉순 (예정작 포함)' },
];

interface MovieListSnapshot {
  movies: Movie[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  completedRequest: string | null;
  scrollPosition: number;
}

export default function MovieListPage() {
  const isListPage = useMatch('/') !== null;
  const [selectedFilter, setSelectedFilter] = useState(RATING_FILTERS[0]);
  const [selectedSort, setSelectedSort] = useState<MovieSort>(SORT_OPTIONS[0].value);
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isRequestInFlight = useRef(false);
  const completedRequest = useRef<string | null>(null);
  const scrollPosition = useRef(0);
  const exploreSnapshot = useRef<MovieListSnapshot | null>(null);

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
  }, [isListPage, searchQuery]);

  useEffect(() => {
    const requestKey = searchQuery
      ? `search:${searchQuery}:${page}`
      : `discover:${selectedFilter.value}:${selectedSort}:${page}`;
    if (!isListPage || completedRequest.current === requestKey) return;

    const controller = new AbortController();
    isRequestInFlight.current = true;

    const request = searchQuery
      ? searchMovies({ query: searchQuery, page }, controller.signal)
      : fetchMovies({ page, sort_by: selectedSort, ...selectedFilter.params }, controller.signal);

    request
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
  }, [selectedFilter, selectedSort, searchQuery, page, isListPage]);

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

    setSelectedFilter(filter);
    resetMovieList();
  }

  function handleSortChange(value: string) {
    const option = SORT_OPTIONS.find((option) => option.value === value);
    if (!option || option.value === selectedSort) return;

    setSelectedSort(option.value);
    resetMovieList();
  }

  function handleSearch(query: string) {
    if (!query || query === searchQuery) return;

    if (!searchQuery) {
      exploreSnapshot.current = {
        movies,
        page,
        hasMore,
        isLoading,
        error,
        completedRequest: completedRequest.current,
        scrollPosition: scrollPosition.current,
      };
    }

    setSearchQuery(query);
    scrollPosition.current = 0;
    resetMovieList();
  }

  function clearSearch() {
    const snapshot = exploreSnapshot.current;
    if (!snapshot) return;

    isRequestInFlight.current = snapshot.isLoading;
    completedRequest.current = snapshot.completedRequest;
    scrollPosition.current = snapshot.scrollPosition;
    setSearchQuery('');
    setMovies(snapshot.movies);
    setPage(snapshot.page);
    setHasMore(snapshot.hasMore);
    setIsLoading(snapshot.isLoading);
    setError(snapshot.error);
    exploreSnapshot.current = null;
  }

  function resetMovieList() {
    isRequestInFlight.current = true;
    completedRequest.current = null;
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
        <h1 id="movie-list-title">{searchQuery ? '영화 검색 결과' : '영화 목록'}</h1>
        <Description>
          {searchQuery
            ? `“${searchQuery}” 검색 결과입니다.`
            : '평점과 정렬 조건으로 영화를 둘러보세요.'}
        </Description>
        <MovieSearch
          isSearching={Boolean(searchQuery)}
          onSearch={handleSearch}
          onClear={clearSearch}
        />
        {!searchQuery && (
          <>
            <SortControl>
              정렬
              <SortSelect
                value={selectedSort}
                onChange={(event) => handleSortChange(event.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SortSelect>
            </SortControl>
            <RatingFilter
              selectedValue={selectedFilter.value}
              onChange={handleFilterChange}
            />
          </>
        )}

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
            {page > 1
              ? '다음 페이지를 불러오는 중이에요.'
              : searchQuery ? '검색 결과를 불러오는 중이에요.' : '영화 목록을 불러오는 중이에요.'}
          </StatusMessage>
        )}
        {error && <StatusMessage role="alert">{error}</StatusMessage>}
        {!isLoading && !error && movies.length === 0 && (
          <StatusMessage role="status">
            {searchQuery
              ? '검색 결과가 없습니다. 다른 제목으로 검색해주세요.'
              : '조건에 맞는 영화가 없습니다.'}
          </StatusMessage>
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

const SortControl = styled.label`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 20px;
`;

const SortSelect = styled.select`
  min-width: 0;
  max-width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  color-scheme: dark;
  font: inherit;
  cursor: pointer;
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
