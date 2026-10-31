import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';

interface MovieSearchProps {
  isSearching: boolean;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export default function MovieSearch({ isSearching, onSearch, onClear }: MovieSearchProps) {
  const [input, setInput] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = input.trim();
    if (!query) return;

    setInput(query);
    onSearch(query);
  }

  function handleClear() {
    setInput('');
    onClear();
  }

  return (
    <SearchForm role="search" onSubmit={handleSubmit}>
      <SearchLabel htmlFor="movie-search">영화 제목 검색</SearchLabel>
      <SearchInput
        id="movie-search"
        type="search"
        placeholder="영화 제목을 입력해주세요"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <SearchButton type="submit">검색</SearchButton>
      {isSearching && (
        <ClearButton type="button" onClick={handleClear}>검색 해제</ClearButton>
      )}
    </SearchForm>
  );
}

const SearchForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
`;

const SearchLabel = styled.label`
  width: 100%;
  font-weight: 600;
`;

const SearchInput = styled.input`
  flex: 1 1 200px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  color-scheme: dark;
  font: inherit;
`;

const SearchButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
`;

const ClearButton = styled(SearchButton)`
  border-color: ${({ theme }) => theme.colors.dark};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
