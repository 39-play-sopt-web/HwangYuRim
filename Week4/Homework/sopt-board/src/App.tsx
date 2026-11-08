import styled from "styled-components";
import { Outlet, Route, Routes } from 'react-router';
import BoardHeader from './components/BoardHeader';
import RequireAuth from './components/RequireAuth';
import IssueCodePage from './pages/IssueCodePage';
import PostListPage from './pages/PostListPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import EditPostPage from './pages/EditPostPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IssueCodePage />} />
      <Route
        path="/posts"
        element={
          <>
            <BoardHeader />
            <Container>
              <PostListPage />
              <Outlet />
            </Container>
          </>
        }
      >
        <Route path=":postId" element={<PostDetailPage />} />
        <Route element={<RequireAuth />}>
          <Route path="new" element={<CreatePostPage />} />
          <Route path=":postId/edit" element={<EditPostPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

const Container = styled.main`
  width: min(100% - 40px, 720px);
  margin: 64px auto;

  h1 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 28px;
  }
`;
