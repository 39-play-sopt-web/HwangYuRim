/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const searchContainerStyle = css`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const buttonStyle = (theme) => css`
  width: 5rem;
  border-radius: 0.5rem;
  border: none;
  padding: 0.5rem 1rem;
  background-color: ${theme.colors.blue};
  color: ${theme.colors.white};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.colors.blueHover};
  }
`;

const inputStyle = (theme) => css`
  width: 40rem;
  border-radius: 0.5rem;
  border: 1px solid ${theme.colors.gray};
  padding: 0.5rem 1rem;
  font-size: ${theme.fonts.sm};
`;

const Search = ({ search, onSearchChange, onSearchClick }) => {
  return (
    <div css={searchContainerStyle}>
      <input
        type="text"
        value={search}
        onChange={onSearchChange}
        placeholder="검색어를 입력하세요"
        css={inputStyle}
      />
      <button type="button" css={buttonStyle} onClick={onSearchClick}>
        검색
      </button>
    </div>
  );
};

export default Search;
