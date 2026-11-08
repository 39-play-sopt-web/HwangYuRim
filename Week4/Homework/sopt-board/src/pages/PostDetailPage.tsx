import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Link, useParams } from 'react-router';
import styled from 'styled-components';
import { fetchPost } from '../api/posts';

export default function PostDetailPage() {
  const { postId: postIdParam = '' } = useParams();
  const postId = Number(postIdParam);
  const isValidId = /^[1-9]\d*$/.test(postIdParam) && Number.isSafeInteger(postId);
  const { data: post, error, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['posts', 'detail', postId],
    queryFn: ({ signal }) => fetchPost(postId, signal),
    enabled: isValidId,
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });

  return (
    <section>
      <BackLink to="/posts">← 목록으로</BackLink>
      {!isValidId && <Message role="alert">올바르지 않은 게시글 주소예요.</Message>}
      {isValidId && isPending && <Message role="status">게시글을 불러오고 있어요.</Message>}
      {isValidId && isError && (
        <ErrorNotice>
          <Message role="alert">
            {isAxiosError(error)
              ? error.response?.status === 404
                ? '게시글을 찾을 수 없어요.'
                : '게시글을 불러오지 못했어요. 연결 상태를 확인하고 다시 시도해주세요.'
              : error.message}
          </Message>
          <RetryButton type="button" disabled={isFetching} onClick={() => void refetch()}>
            다시 시도
          </RetryButton>
        </ErrorNotice>
      )}
      {isValidId && post && !isError && (
        <Article aria-labelledby="post-detail-title">
          <Title id="post-detail-title">{post.title}</Title>
          <Information>
            <Author>{post.author}</Author>
            <time dateTime={post.createdAt}>
              {post.createdAt.replace('T', ' ').slice(0, 16)}
            </time>
          </Information>
          <Content>{post.content}</Content>
          <Actions>
            <EditLink to={`/posts/${post.id}/edit`}>수정</EditLink>
          </Actions>
        </Article>
      )}
    </section>
  );
}

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 24px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`;

const Article = styled.article`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  overflow-wrap: anywhere;
`;

const Title = styled.h1`
  margin: 0 0 12px;
`;

const Information = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const Author = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const Content = styled.p`
  margin: 24px 0 0;
  white-space: pre-wrap;
`;

const Message = styled.p`
  margin: 16px 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const EditLink = styled(Link)`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`;

const ErrorNotice = styled.div`
  margin-bottom: 24px;
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
