import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Link, useParams } from 'react-router';
import styled from 'styled-components';
import { fetchMovieDetail, getMovieImageUrl } from '../api/movies';
import type { MovieDetail } from '../types/movie';

const LANGUAGE_NAMES = new Intl.DisplayNames(['ko'], { type: 'language' });
const MOVIE_STATUS_LABELS: Record<string, string> = {
  Rumored: '제작 미확정',
  Planned: '제작 예정',
  'In Production': '제작 중',
  'Post Production': '후반 작업 중',
  Released: '개봉됨',
  Canceled: '제작 취소',
};

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const parsedMovieId = Number(movieId);
  const isValidId = movieId !== undefined
    && /^[1-9]\d*$/.test(movieId)
    && Number.isSafeInteger(parsedMovieId);

  return (
    <>
      <BackLink to="/">← 목록으로 돌아가기</BackLink>
      {isValidId ? (
        <MovieDetailContent key={movieId} movieId={parsedMovieId} />
      ) : (
        <>
          <h1>영화 상세</h1>
          <p role="alert">올바르지 않은 영화 ID입니다.</p>
        </>
      )}
    </>
  );
}

interface MovieDetailContentProps {
  movieId: number;
}

function MovieDetailContent({ movieId }: MovieDetailContentProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posterFailed, setPosterFailed] = useState(false);
  const [backdropFailed, setBackdropFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetchMovieDetail(movieId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setMovie(data);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        if (isAxiosError(error) && error.response?.status === 404) {
          setError('존재하지 않는 영화입니다.');
        } else {
          setError(
            error instanceof Error && !isAxiosError(error)
              ? error.message
              : '영화 정보를 불러오지 못했어요. 연결 상태를 확인한 뒤 새로고침해주세요.',
          );
        }
      });

    return () => controller.abort();
  }, [movieId]);

  if (error) {
    return (
      <>
        <h1>영화 상세</h1>
        <p role="alert">{error}</p>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <h1>영화 상세</h1>
        <p role="status">영화 정보를 불러오는 중이에요.</p>
      </>
    );
  }

  const posterUrl = getMovieImageUrl(movie.poster_path);
  const backdropUrl = getMovieImageUrl(movie.backdrop_path, 'original');
  const rating = (Math.floor(movie.vote_average * 10) / 10).toFixed(1);

  return (
    <article aria-labelledby="movie-title">
      <BackdropFrame>
        {backdropUrl && !backdropFailed ? (
          <Backdrop
            src={backdropUrl}
            alt={`${movie.title} 배경 이미지`}
            onError={() => setBackdropFailed(true)}
          />
        ) : (
          <span>배경 이미지가 없습니다.</span>
        )}
      </BackdropFrame>
      <DetailLayout>
        <PosterFrame>
          {posterUrl && !posterFailed ? (
            <Poster
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              onError={() => setPosterFailed(true)}
            />
          ) : (
            <span role="img" aria-label={`${movie.title} 포스터 없음`}>포스터 없음</span>
          )}
        </PosterFrame>
        <div>
          <h1 id="movie-title">{movie.title}</h1>
          <Metadata>
            <div>
              <dt>개봉일</dt>
              <dd>
                {movie.release_date ? (
                  <time dateTime={movie.release_date}>{movie.release_date}</time>
                ) : '미정'}
              </dd>
            </div>
            <div>
              <dt>장르</dt>
              <dd>{movie.genres.map((genre) => genre.name).join(', ') || '정보 없음'}</dd>
            </div>
            <div>
              <dt>평점</dt>
              <dd><Rating>★ {rating} / 10</Rating></dd>
            </div>
            <div>
              <dt>상영 시간</dt>
              <dd>{formatRuntime(movie.runtime)}</dd>
            </div>
            <div>
              <dt>투표 수</dt>
              <dd>{movie.vote_count.toLocaleString('ko-KR')}표</dd>
            </div>
            <div>
              <dt>상태</dt>
              <dd>{MOVIE_STATUS_LABELS[movie.status] || movie.status || '정보 없음'}</dd>
            </div>
          </Metadata>
          <SectionTitle>줄거리</SectionTitle>
          <Overview>{movie.overview.trim() || '등록된 줄거리가 없습니다.'}</Overview>
          <SectionTitle>기본 정보</SectionTitle>
          <Metadata>
            <div>
              <dt>원제</dt>
              <dd>{movie.original_title || movie.title}</dd>
            </div>
            <div>
              <dt>원어</dt>
              <dd>{formatLanguage(movie.original_language)}</dd>
            </div>
            <div>
              <dt>제작 국가</dt>
              <dd>
                {movie.production_countries.map((country) => country.name).join(', ') || '정보 없음'}
              </dd>
            </div>
            <div>
              <dt>사용 언어</dt>
              <dd>
                {movie.spoken_languages
                  .map((language) => formatLanguage(language.iso_639_1))
                  .join(', ') || '정보 없음'}
              </dd>
            </div>
            <div>
              <dt>예산</dt>
              <dd>{formatUsd(movie.budget)}</dd>
            </div>
            <div>
              <dt>수익</dt>
              <dd>{formatUsd(movie.revenue)}</dd>
            </div>
          </Metadata>
        </div>
      </DetailLayout>
    </article>
  );
}

function formatRuntime(runtime: number | null): string {
  if (runtime === null || runtime <= 0) return '정보 없음';

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  return minutes === 0 ? `${hours}시간` : `${hours}시간 ${minutes}분`;
}

function formatLanguage(code: string): string {
  return code ? LANGUAGE_NAMES.of(code) || code : '정보 없음';
}

function formatUsd(amount: number): string {
  return amount > 0 ? `${amount.toLocaleString('ko-KR')} USD` : '정보 없음';
}

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.accent};
`;

const BackdropFrame = styled.div`
  display: grid;
  min-height: 140px;
  aspect-ratio: 16 / 6;
  margin-bottom: 32px;
  overflow: hidden;
  place-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.dark};
`;

const Backdrop = styled.img`
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: cover;
`;

const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
  gap: 32px;
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const PosterFrame = styled.div`
  display: grid;
  width: 100%;
  max-width: 280px;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  place-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.dark};
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: cover;
`;

const Metadata = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
  gap: 20px;
  margin: 24px 0;

  dt {
    margin-bottom: 4px;
    color: ${({ theme }) => theme.colors.muted};
  }

  dd {
    margin: 0;
  }
`;

const Rating = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
`;

const SectionTitle = styled.h2`
  margin: 32px 0 12px;
  font-size: 20px;
`;

const Overview = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-line;
`;
