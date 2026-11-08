import { client } from './client';
import { readAuth } from '../auth';
import type { CreatePostInput, Post, PostSlice, UpdatePostInput } from '../types/post';

interface PostListParams {
  keyword?: string;
  cursor?: number;
  size?: number;
}

interface PostResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T | null;
}

export async function fetchPosts(
  params: PostListParams = {},
  signal?: AbortSignal,
): Promise<PostSlice> {
  const { data } = await client.get<PostResponse<PostSlice>>('/posts', {
    params,
    signal,
  });

  if (!data.isSuccess || !data.data) {
    throw new Error('게시글 목록을 불러오지 못했어요. 다시 시도해주세요.');
  }

  return data.data;
}

export async function fetchPost(postId: number, signal?: AbortSignal): Promise<Post> {
  const { data } = await client.get<PostResponse<Post>>(`/posts/${postId}`, {
    signal,
  });

  if (!data.isSuccess || !data.data) {
    throw new Error('게시글을 불러오지 못했어요. 다시 시도해주세요.');
  }

  return data.data;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const auth = readAuth();
  if (!auth) {
    throw new Error('글을 작성하려면 먼저 회원 코드를 발급받아주세요.');
  }

  const { data } = await client.post<PostResponse<Post>>('/posts', input, {
    headers: { Authorization: auth.authorizationCode },
  });

  if (!data.isSuccess || !data.data) {
    throw new Error('게시글 작성에 실패했어요. 다시 시도해주세요.');
  }

  return data.data;
}

export async function updatePost(postId: number, input: UpdatePostInput): Promise<Post> {
  const auth = readAuth();
  if (!auth) {
    throw new Error('글을 수정하려면 먼저 회원 코드를 발급받아주세요.');
  }

  const { data } = await client.put<PostResponse<Post>>(`/posts/${postId}`, input, {
    headers: { Authorization: auth.authorizationCode },
  });

  if (!data.isSuccess || !data.data) {
    throw new Error('게시글 수정에 실패했어요. 다시 시도해주세요.');
  }

  return data.data;
}

export async function deletePost(postId: number): Promise<void> {
  const auth = readAuth();
  if (!auth) {
    throw new Error('글을 삭제하려면 먼저 회원 코드를 발급받아주세요.');
  }

  const { data } = await client.delete<PostResponse<null>>(`/posts/${postId}`, {
    headers: { Authorization: auth.authorizationCode },
  });

  if (!data.isSuccess) {
    throw new Error('게시글 삭제에 실패했어요. 다시 시도해주세요.');
  }
}
