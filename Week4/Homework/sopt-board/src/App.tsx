import styled from "styled-components";

export default function App() {
  return (
    <Container>
      <h1>SOPT Board💌</h1>
    </Container>
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
