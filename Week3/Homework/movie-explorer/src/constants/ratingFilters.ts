import type { MovieRatingParams } from '../types/movie';

export interface RatingFilterOption {
  value: 'all' | '9' | '8' | '7' | '6' | 'below6';
  label: string;
  params: MovieRatingParams;
}

export const RATING_FILTERS: RatingFilterOption[] = [
  { value: 'all', label: '전체', params: {} },
  {
    value: '9',
    label: '9점 이상',
    params: { 'vote_average.gte': 9 },
  },
  {
    value: '8',
    label: '8점 이상 9점 미만',
    params: { 'vote_average.gte': 8, 'vote_average.lte': 8.999 },
  },
  {
    value: '7',
    label: '7점 이상 8점 미만',
    params: { 'vote_average.gte': 7, 'vote_average.lte': 7.999 },
  },
  {
    value: '6',
    label: '6점 이상 7점 미만',
    params: { 'vote_average.gte': 6, 'vote_average.lte': 6.999 },
  },
  {
    value: 'below6',
    label: '6점 미만',
    params: { 'vote_average.lte': 5.999 },
  },
];
