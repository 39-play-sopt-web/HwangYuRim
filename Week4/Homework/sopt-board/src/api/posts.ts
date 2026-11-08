import { client } from './client';
import type { PostSlice } from '../types/post';

interface PostListParams {
  keyword?: string;
  cursor?: number;
  size?: number;
}

interface PostListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: PostSlice | null;
}

export async function fetchPosts(
  params: PostListParams = {},
  signal?: AbortSignal,
): Promise<PostSlice> {
  const { data } = await client.get<PostListResponse>('/posts', {
    params,
    signal,
  });

  if (!data.isSuccess || !data.data) {
    throw new Error('게시글 목록을 불러오지 못했어요. 다시 시도해주세요.');
  }

  return data.data;
}
