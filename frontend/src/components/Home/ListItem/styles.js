// components/Home/ListItem/styles.js
import styled from "styled-components";
import { theme } from "../../../styles/theme"; // ajuste o caminho conforme sua estrutura

export const ItemCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderColor};
  border-left: 4px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  background: white;
  transition: all 0.2s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  gap: ${theme.spacing.md};
  
  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: ${props => props.clickable ? 'translateY(-2px)' : 'none'};
  }
`;

export const ItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  flex: 1;
`;

export const ItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.primary};
  font-size: 1.2rem;
  flex-shrink: 0;
`;

export const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const ItemTitle = styled.h3`
  margin: 0;
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textColor};
  font-family: ${theme.fontFamilies.inter};
`;

export const ItemDescription = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textColorMuted};
  line-height: 1.4;
  
  svg {
    flex-shrink: 0;
    color: ${theme.colors.textColorMuted};
  }
`;

export const ItemPhone = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textColorMuted};
  
  svg {
    flex-shrink: 0;
    color: ${theme.colors.primary};
  }
`;

export const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textColorMuted};
  
  svg {
    flex-shrink: 0;
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s;
  flex-shrink: 0;
  align-self: flex-start;
  
  &:hover {
    background: #fee2e2;
  }
  
  svg {
    color: #dc2626;
  }
`;

// Estilo para o badge de status
export const StatusBadge = styled.div`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: ${props => {
    const status = props.status?.toLowerCase();
    if (status === 'ativo' || status === 'aprovado' || status === 'concluído') {
      return '#e8f5e8';
    } else if (status === 'inativo' || status === 'cancelado' || status === 'rejeitado') {
      return '#ffe6e6';
    } else {
      return '#fff3cd';
    }
  }};
  color: ${props => {
    const status = props.status?.toLowerCase();
    if (status === 'ativo' || status === 'aprovado' || status === 'concluído') {
      return '#2d5016';
    } else if (status === 'inativo' || status === 'cancelado' || status === 'rejeitado') {
      return '#cc0000';
    } else {
      return '#856404';
    }
  }};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  margin-top: ${theme.spacing.xs};
`;