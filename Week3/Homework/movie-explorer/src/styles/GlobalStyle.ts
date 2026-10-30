import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  h1 {
    margin: 0 0 16px;
    font-size: clamp(24px, 4vw, 32px);
    line-height: 1.3;
  }

  p {
    color: ${({ theme }) => theme.colors.muted};
  }

  a {
    color: inherit;
  }

  button {
    font: inherit;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 4px;
  }
`;
