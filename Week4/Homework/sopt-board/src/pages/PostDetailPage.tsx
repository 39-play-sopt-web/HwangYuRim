import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Link, useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { deletePost, fetchPost } from '../api/posts';

export default function PostDetailPage() {
  const { postId: postIdParam = '' } = useParams();
  const postId = Number(postIdParam);
  const isValidId = /^[1-9]\d*$/.test(postIdParam) && Number.isSafeInteger(postId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: post, error, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['posts', 'detail', postId],
    queryFn: ({ signal }) => fetchPost(postId, signal),
    enabled: isValidId,
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (_data, deletedPostId) => {
      await queryClient.cancelQueries({ queryKey: ['posts', 'detail', deletedPostId], exact: true });
      queryClient.removeQueries({ queryKey: ['posts', 'detail', deletedPostId], exact: true });
      await queryClient.invalidateQueries({ queryKey: ['posts', 'list'] });
    },
  });

  function handleDelete() {
    if (!post || deletePostMutation.isPending) return;
    if (!window.confirm('정말 삭제하시겠어요?')) return;

    deletePostMutation.mutate(post.id, {
      onSuccess: () => navigate('/posts', { replace: true }),
      onError: (error) => {
        let message = '게시글 삭제에 실패했어요. 연결 상태와 회원 코드를 확인하고 다시 시도해주세요.';
        if (!isAxiosError(error)) {
          message = error.message;
        } else if (error.response?.status === 403) {
          message = '삭제 권한이 없어요. 글을 작성할 때 사용한 회원 코드인지 확인해주세요.';
        }
        window.alert(message);
      },
    });
  }

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
            <EditLink
              to={`/posts/${post.id}/edit`}
              aria-disabled={deletePostMutation.isPending}
              onClick={(event) => {
                if (deletePostMutation.isPending) event.preventDefault();
              }}
            >
              수정
            </EditLink>
            <DeleteButton
              type="button"
              disabled={deletePostMutation.isPending}
              onClick={handleDelete}
            >
              {deletePostMutation.isPending ? '삭제 중…' : '삭제'}
            </DeleteButton>
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
  flex-wrap: wrap;
  gap: 8px;
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

  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
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
