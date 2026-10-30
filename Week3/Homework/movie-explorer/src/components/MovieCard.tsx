import { useState } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { getMovieImageUrl } from '../api/movies';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const posterUrl = getMovieImageUrl(movie.poster_path);

  return (
    <Card to={`/movies/${movie.id}`}>
      {posterUrl && !imageFailed ? (
        <Poster
          src={posterUrl}
          alt={`${movie.title} 포스터`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <PosterPlaceholder role="img" aria-label={`${movie.title} 포스터 없음`}>
          포스터 없음
        </PosterPlaceholder>
      )}
      <Information>
        <Title>{movie.title}</Title>
        <ReleaseDate>
          개봉일 ·{' '}
          {movie.release_date ? (
            <time dateTime={movie.release_date}>{movie.release_date}</time>
          ) : (
            '미정'
          )}
        </ReleaseDate>
        <Overview>{movie.overview.trim() || '등록된 줄거리가 없습니다.'}</Overview>
        <Rating aria-label={`평점 10점 만점에 ${movie.vote_average.toFixed(1)}점`}>
          ★ {movie.vote_average.toFixed(1)} / 10
        </Rating>
      </Information>
    </Card>
  );
}

const Card = styled(Link)`
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-radius: 8px;
  text-decoration: none;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Poster = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
`;

const PosterPlaceholder = styled.div`
  display: grid;
  width: 100%;
  aspect-ratio: 2 / 3;
  place-items: center;
  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.text};
`;

const Information = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
`;

const Title = styled.h2`
  display: -webkit-box;
  min-height: 2.8em;
  margin: 0;
  overflow: hidden;
  font-size: 20px;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const ReleaseDate = styled.p`
  margin: 0;
  font-size: 14px;
`;

const Overview = styled.p`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  font-size: 14px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`;

const Rating = styled.p`
  margin: auto 0 0;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
`;
