import { Global, css } from '@emotion/react'

function GlobalStyle() {
  return (
    <Global
      styles={(theme) => css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html {
          min-width: 320px;
          background-color: ${theme.colors.background};
        }

        body {
          min-width: 320px;
          min-height: 100vh;
          margin: 0;
          color: ${theme.colors.text};
          background-color: ${theme.colors.background};
          font-family:
            Arial,
            system-ui,
            -apple-system,
            sans-serif;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }

        button,
        select {
          color: inherit;
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        button:focus-visible,
        select:focus-visible {
          outline: 3px solid ${theme.colors.focus};
          outline-offset: 2px;
        }
      `}
    />
  )
}

export default GlobalStyle
