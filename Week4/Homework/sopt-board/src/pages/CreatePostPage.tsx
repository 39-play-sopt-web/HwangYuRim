import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import { createPost } from '../api/posts';
import { readAuth } from '../auth';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts', 'list'] }),
  });
  const titleError = title.length > 50 ? '제목은 50자 이하로 입력해주세요.' : '';
  const contentError = content.length > 1000 ? '본문은 1000자 이하로 입력해주세요.' : '';
  const authorError = author.length > 20 ? '작성자는 20자 이하로 입력해주세요.' : '';
  const canSubmit = Boolean(
    title.trim() && content.trim() && author.trim() &&
    !titleError && !contentError && !authorError,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || createPostMutation.isPending) return;

    if (!readAuth()) {
      window.alert('글을 작성하려면 먼저 회원 코드를 발급받아주세요.');
      navigate('/', { replace: true });
      return;
    }

    createPostMutation.mutate(
      { title: title.trim(), content, author: author.trim() },
      {
        onSuccess: (_post, input) => {
          window.alert(`${input.author}님의 게시글이 작성되었어요.`);
          navigate('/posts');
        },
        onError: (error) => {
          window.alert(
            isAxiosError(error)
              ? '게시글 작성에 실패했어요. 연결 상태와 회원 코드를 확인하고 다시 시도해주세요.'
              : error.message,
          );
        },
      },
    );
  }

  return (
    <section aria-labelledby="create-post-title">
      <h1 id="create-post-title">게시글 작성</h1>
      <Form onSubmit={handleSubmit} aria-busy={createPostMutation.isPending}>
        <Fields disabled={createPostMutation.isPending}>
          <Field>
            <label htmlFor="post-title">제목</label>
            <Input
              id="post-title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? 'post-title-error' : undefined}
              required
            />
            {titleError && <ErrorMessage id="post-title-error">{titleError}</ErrorMessage>}
          </Field>
          <Field>
            <label htmlFor="post-content">본문</label>
            <TextArea
              id="post-content"
              name="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              aria-invalid={Boolean(contentError)}
              aria-describedby={contentError ? 'post-content-error' : undefined}
              required
            />
            {contentError && <ErrorMessage id="post-content-error">{contentError}</ErrorMessage>}
          </Field>
          <Field>
            <label htmlFor="post-author">작성자</label>
            <Input
              id="post-author"
              name="author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              aria-invalid={Boolean(authorError)}
              aria-describedby={authorError ? 'post-author-error' : undefined}
              required
            />
            {authorError && <ErrorMessage id="post-author-error">{authorError}</ErrorMessage>}
          </Field>
        </Fields>
        <Actions>
          <ListLink to="/posts">목록으로</ListLink>
          <SubmitButton type="submit" disabled={!canSubmit || createPostMutation.isPending}>
            {createPostMutation.isPending ? '작성 중…' : '작성'}
          </SubmitButton>
        </Actions>
      </Form>
    </section>
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

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
`;

const ListLink = styled(Link)`
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`;

const SubmitButton = styled.button`
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
