import styled from "styled-components";


export const ButtonElement = styled.button`
  font-family: inherit;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: white;
  height: 48px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.primaryLinear},
    ${({ theme }) => theme.colors.primary}
  );
  transition: all 300ms ease-in-out;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  /* --- Estilo alternativo (variant = 'background_transparent') --- */
  ${({ variant, theme }) =>
    variant === "background_transparent" &&
    `
      background: transparent;
      border: 1px solid ${theme.colors.primary};
      color: ${theme.colors.primary};
      font-weight: ${theme.fontWeights.medium};

      &:hover {
        /* background: ${theme.colors.danger}; */
        color: white;
      }
  `}
`;
