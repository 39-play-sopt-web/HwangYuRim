import styled from 'styled-components';
import type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card>
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

const Card = styled.article`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  overflow-wrap: anywhere;
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
