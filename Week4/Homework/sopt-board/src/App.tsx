import styled from "styled-components";
import { Route, Routes } from 'react-router';
import IssueCodePage from './pages/IssueCodePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IssueCodePage />} />
      <Route
        path="/posts"
        element={
          <Container>
            <h1>SOPT Board💌</h1>
          </Container>
        }
      />
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
