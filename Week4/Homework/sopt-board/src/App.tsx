import styled from "styled-components";
import { Outlet, Route, Routes } from 'react-router';
import BoardHeader from './components/BoardHeader';
import IssueCodePage from './pages/IssueCodePage';

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
              <Outlet />
            </Container>
          </>
        }
      >
        <Route index element={<h1>SOPT Board💌</h1>} />
        <Route path="new" element={<h1>글쓰기</h1>} />
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
