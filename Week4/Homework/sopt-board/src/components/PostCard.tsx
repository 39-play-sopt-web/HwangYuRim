import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { Link } from 'react-router';
import { postDetailQueryOptions } from '../api/posts';
import type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const queryClient = useQueryClient();

  function prefetchPost() {
    void queryClient.prefetchQuery(postDetailQueryOptions(post.id));
  }

  return (
    <Card
      to={`/posts/${post.id}`}
      onMouseEnter={prefetchPost}
      onFocus={prefetchPost}
    >
      <Title>{post.title}</Title>
      <Preview>{post.content}</Preview>
      <Information>
        <Author>{post.author}</Author>
        <time dateTime={post.createdAt}>
          {post.createdAt.replace('T', ' ').slice(0, 16)}
        </time>
      </Information>
    </Card>
  );
}

const Card = styled(Link)`
  display: block;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  overflow-wrap: anywhere;
  transition: border-color 150ms ease;

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 18px;
`;

const Preview = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: pre-line;
`;

const Information = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

const Author = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;
