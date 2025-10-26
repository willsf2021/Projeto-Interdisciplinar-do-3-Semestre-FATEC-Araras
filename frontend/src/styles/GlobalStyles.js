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

`;
