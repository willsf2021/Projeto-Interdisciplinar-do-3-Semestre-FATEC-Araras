import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    height: 100dvh;
    font-family: ${({ theme }) => theme.fontFamilies.inter};
    color: ${({ theme }) => theme.colors.textColor}
    /* Exemplo de como usar variáveis de 'theme' */
    /* background-color: ${({ theme }) => theme.colors.primary} */
  }

  #root {
    height:100%
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
  }
  ul li  {
    list-style: none;
  }
  .spinner {
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-left-color: #fff;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    display: inline-block;
    margin-right: 8px;
    animation: spin 0.8s linear infinite;
    vertical-align: middle;
  }

  .step-content h3 {
    font-size: ${({ theme }) => theme.fontSizes.base};
    margin-bottom: 24px;
    color: ${({ theme }) => theme.colors.textColor};
    text-align:center;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

`;
