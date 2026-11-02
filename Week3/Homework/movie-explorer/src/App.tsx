import { Link, Outlet } from 'react-router';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header>
        <Brand to="/">영화 탐색</Brand>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </ThemeProvider>
  );
}

const Header = styled.header`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dark};
`;

const Brand = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 24px;
  font-weight: 700;
  text-decoration: none;
`;

const Content = styled.main`
  width: min(100% - 40px, 1200px);
  margin: 40px auto;
`;
