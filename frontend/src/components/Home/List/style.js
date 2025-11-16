// components/Home/List/style.js
import styled from "styled-components";
import { theme } from "../../../styles/theme"; // ajuste o caminho conforme sua estrutura

export const ListContainer = styled.div`
  margin-top: ${theme.spacing.md};
  padding: 0 ${theme.spacing.md};
`;

export const ListHeader = styled.div`
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textColorMuted};
  padding: 0 ${theme.spacing.sm};
`;

export const ListGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm} 0;
  padding-right: ${theme.spacing.sm};
  max-height: none;
  /* Scrollbar customizada - igual ao exemplo de ingredientes */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primaryHover};
  }
`;
