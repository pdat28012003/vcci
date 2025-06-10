import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  /* Reset CSS */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: ${theme.colors.text};
    background-color: ${theme.colors.background};
  }

  a {
    color: ${theme.colors.accent};
    text-decoration: none;
    transition: color ${theme.transitions.fast} ease;

    &:hover {
      color: ${theme.colors.primary};
    }
  }

  ul, ol {
    list-style: none;
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
  }

  /* Màn hình loading */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }

  /* Các style cho bảng tin */
  .news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
    margin-top: 20px;
  }

  /* Các style cho hướng dẫn sử dụng */
  .guide-container {
    max-width: 100%;
    margin: 0 auto;
  }

  /* Responsive */
  @media (max-width: ${theme.breakpoints.md}) {
    html {
      font-size: 14px;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    html {
      font-size: 12px;
    }
  }
`;

export default GlobalStyles;