import { useEffect, useRef, useState } from 'react';
import type { SubmitEvent } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import styled from 'styled-components';
import { fetchPosts } from '../api/posts';
import PostCard from '../components/PostCard';

export default function PostListPage() {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const lastPostRef = useRef<HTMLLIElement>(null);
  const {
    data,
    error,
    isPending,
    isFetching,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts', 'list', 'infinite', { keyword }],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => fetchPosts({
      keyword: keyword || undefined,
      cursor: pageParam === 0 ? undefined : pageParam,
    }, signal),
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext || lastPage.posts.length === 0) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
  });
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const trimmedInput = input.trim();
  const searchError = trimmedInput.length > 0 &&
    (trimmedInput.length < 2 || trimmedInput.length > 50)
    ? '검색어는 2~50자로 입력해주세요.'
    : '';

  useEffect(() => {
    const target = lastPostRef.current;
    if (!target || !hasNextPage || isFetching || isError) return;

    let active = true;
    let requested = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!active || !entry?.isIntersecting || requested) return;

      requested = true;
      void fetchNextPage({ cancelRefetch: false });
    }, { rootMargin: '200px' });

    observer.observe(target);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetching, isError, keyword, posts.length]);

  function handleRetry() {
    if (isFetching) return;

    if (isFetchNextPageError) {
      void fetchNextPage({ cancelRefetch: false });
    } else {
      void refetch();
    }
  }

  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedInput || searchError) return;

    if (trimmedInput === keyword) {
      handleRetry();
      return;
    }

    setKeyword(trimmedInput);
  }

  return (
    <section aria-labelledby="post-list-title">
      <h1 id="post-list-title">게시글 목록</h1>
      <SearchForm role="search" onSubmit={handleSearch}>
        <label htmlFor="post-keyword">제목 검색</label>
        <SearchFields>
          <SearchInput
            id="post-keyword"
            name="keyword"
            type="search"
            placeholder="제목으로 검색"
            value={input}
            aria-invalid={Boolean(searchError)}
            aria-describedby={searchError ? 'post-search-error' : undefined}
            onChange={(event) => {
              const value = event.target.value;
              setInput(value);
              if (!value.trim()) setKeyword('');
            }}
          />
          <SearchButton type="submit" disabled={!trimmedInput || Boolean(searchError)}>
            검색
          </SearchButton>
        </SearchFields>
        {searchError && <ErrorMessage id="post-search-error">{searchError}</ErrorMessage>}
      </SearchForm>
      {isPending && <Status role="status">게시글을 불러오고 있어요.</Status>}
      {!isPending && isFetching && !isFetchingNextPage && (
        <Status role="status">게시글을 갱신하고 있어요.</Status>
      )}
      {posts.length > 0 && (
        <PostList>
          {posts.map((post, index) => (
            <li key={post.id} ref={index === posts.length - 1 ? lastPostRef : undefined}>
              <PostCard post={post} />
            </li>
          ))}
        </PostList>
      )}
      {isFetchingNextPage && <Status role="status">다음 게시글을 불러오고 있어요.</Status>}
      {isError && (
        <ErrorNotice>
          <ErrorMessage role="alert">
            {isFetchNextPageError
              ? '다음 게시글을 불러오지 못했어요. 연결 상태를 확인하고 다시 시도해주세요.'
              : isAxiosError(error)
              ? '게시글을 불러오지 못했어요. 연결 상태를 확인하고 다시 시도해주세요.'
              : error.message}
          </ErrorMessage>
          <RetryButton type="button" disabled={isFetching} onClick={handleRetry}>
            다시 시도
          </RetryButton>
        </ErrorNotice>
      )}
      {data && posts.length === 0 && !isError && !isFetching && (
        <Status role="status">
          {keyword ? '검색 결과가 없어요.' : '아직 등록된 게시글이 없어요.'}
        </Status>
      )}
      {posts.length > 0 && !hasNextPage && !isFetching && !isError && (
        <Status role="status">모든 게시글을 불러왔어요.</Status>
      )}
    </section>
  );
}

const SearchForm = styled.form`
  margin-bottom: 24px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
  }
`;

const SearchFields = styled.div`
  display: flex;
  gap: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const SearchButton = styled.button`
  padding: 12px 20px;
  border: 0;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PostList = styled.ul`
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Status = styled.p`
  margin: 24px 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorMessage = styled.p`
  margin: 8px 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
`;

const ErrorNotice = styled.div`
  margin: 24px 0;
`;

const RetryButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
