import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Link, useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { fetchPost, updatePost } from '../api/posts';
import { readAuth } from '../auth';
import type { Post, UpdatePostInput } from '../types/post';

export default function EditPostPage() {
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
    <section aria-labelledby="edit-post-title">
      <h1 id="edit-post-title">게시글 수정</h1>
      {!isValidId && (
        <>
          <p role="alert">올바르지 않은 게시글 주소예요.</p>
          <CancelLink to="/posts">목록으로</CancelLink>
        </>
      )}
      {isValidId && isPending && <p role="status">게시글을 불러오고 있어요.</p>}
      {isValidId && isError && (
        <ErrorNotice>
          <p role="alert">
            {isAxiosError(error) && error.response?.status === 404
              ? '게시글을 찾을 수 없어요.'
              : '게시글을 불러오지 못했어요. 다시 시도해주세요.'}
          </p>
          <Actions>
            <CancelLink to="/posts">목록으로</CancelLink>
            <Button type="button" disabled={isFetching} onClick={() => void refetch()}>
              다시 시도
            </Button>
          </Actions>
        </ErrorNotice>
      )}
      {isValidId && post && <EditPostForm key={post.id} post={post} />}
    </section>
  );
}

function EditPostForm({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updatePostMutation = useMutation({
    mutationFn: (input: UpdatePostInput) => updatePost(post.id, input),
    onSuccess: async (updatedPost) => {
      queryClient.setQueryData(['posts', 'detail', post.id], updatedPost);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts', 'list'] }),
        queryClient.invalidateQueries({ queryKey: ['posts', 'detail', post.id], exact: true }),
      ]);
    },
  });
  const titleError = title.length > 50 ? '제목은 50자 이하로 입력해주세요.' : '';
  const contentError = content.length > 1000 ? '본문은 1000자 이하로 입력해주세요.' : '';
  const canSubmit = Boolean(title.trim() && content.trim() && !titleError && !contentError);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || updatePostMutation.isPending) return;

    if (!readAuth()) {
      window.alert('글을 수정하려면 먼저 회원 코드를 발급받아주세요.');
      navigate('/', { replace: true });
      return;
    }

    updatePostMutation.mutate(
      { title: title.trim(), content },
      {
        onSuccess: () => {
          window.alert('게시글이 수정되었어요.');
          navigate(`/posts/${post.id}`, { replace: true });
        },
        onError: (error) => {
          let message = '게시글 수정에 실패했어요. 연결 상태와 회원 코드를 확인하고 다시 시도해주세요.';
          if (!isAxiosError(error)) {
            message = error.message;
          } else if (error.response?.status === 403) {
            message = '수정 권한이 없어요. 글을 작성할 때 사용한 회원 코드인지 확인해주세요.';
          }
          window.alert(message);
        },
      },
    );
  }

  return (
    <Form onSubmit={handleSubmit} aria-busy={updatePostMutation.isPending}>
      <Fields disabled={updatePostMutation.isPending}>
        <Field>
          <label htmlFor="edit-title">제목</label>
          <Input
            id="edit-title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? 'edit-title-error' : undefined}
            required
          />
          {titleError && <ErrorMessage id="edit-title-error">{titleError}</ErrorMessage>}
        </Field>
        <Field>
          <label htmlFor="edit-content">본문</label>
          <TextArea
            id="edit-content"
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            aria-invalid={Boolean(contentError)}
            aria-describedby={contentError ? 'edit-content-error' : undefined}
            required
          />
          {contentError && <ErrorMessage id="edit-content-error">{contentError}</ErrorMessage>}
        </Field>
      </Fields>
      <Actions>
        <CancelButton
          type="button"
          disabled={updatePostMutation.isPending}
          onClick={() => navigate(`/posts/${post.id}`, { replace: true })}
        >
          취소
        </CancelButton>
        <Button type="submit" disabled={!canSubmit || updatePostMutation.isPending}>
          {updatePostMutation.isPending ? '수정 중…' : '수정 완료'}
        </Button>
      </Actions>
    </Form>
  );
}

const Form = styled.form`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
`;

const Fields = styled.fieldset`
  display: grid;
  gap: 24px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
`;

const Field = styled.div`
  display: grid;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
  }
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 240px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
`;

const ErrorNotice = styled.div`
  margin-bottom: 24px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
`;

const CancelLink = styled(Link)`
  display: inline-block;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`;

const Button = styled.button`
  padding: 10px 16px;
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

const CancelButton = styled.button`
  padding: 10px 16px;
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
