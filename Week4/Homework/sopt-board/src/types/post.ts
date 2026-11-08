export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostSlice {
  posts: Post[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface CreatePostInput {
  title: string;
  content: string;
  author: string;
}

export interface UpdatePostInput {
  title: string;
  content: string;
}
