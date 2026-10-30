import styled from 'styled-components';
import { RATING_FILTERS } from '../constants/ratingFilters';
import type { RatingFilterOption } from '../constants/ratingFilters';

interface RatingFilterProps {
  selectedValue: RatingFilterOption['value'];
  onChange: (filter: RatingFilterOption) => void;
}

export default function RatingFilter({ selectedValue, onChange }: RatingFilterProps) {
  return (
    <FilterGroup role="group" aria-label="평점 필터">
      {RATING_FILTERS.map((filter) => (
        <FilterButton
          key={filter.value}
          type="button"
          aria-pressed={selectedValue === filter.value}
          onClick={() => onChange(filter)}
        >
          {filter.label}
        </FilterButton>
      ))}
    </FilterGroup>
  );
}

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
`;

const FilterButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.background};
  }
`;
