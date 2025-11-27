import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  overflow-x: hidden;
`;

export const IngredientsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AddButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.primaryLinear},
    ${({ theme }) => theme.colors.primary}
  );
  border: none;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const IngredientsListContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

export const IngredientsListHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textColorMuted};
  padding: 0 ${({ theme }) => theme.spacing.sm};
`;

export const IngredientsListGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  padding-right: ${({ theme }) => theme.spacing.sm};
  max-height: 400px;
  overflow-y: auto;

  /* Scrollbar customizada - igual ao exemplo de ingredientes e lista da home */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const IngredientItemCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: white;
  transition: all 0.2s ease;
  cursor: default;
  gap: ${({ theme }) => theme.spacing.md};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const IngredientItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

export const IngredientItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
  flex-shrink: 0;
`;

export const IngredientItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const IngredientItemTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm} !important;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fontFamilies.inter};
  text-align: left !important;
`;

export const IngredientItemDescription = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textColorMuted};
  line-height: 1.4;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.textColorMuted};
  }
`;

export const IngredientItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textColorMuted};

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// RemoveButton já existe, mas vamos ajustar para ficar igual ao da lista
export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
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

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textColorMuted};
  font-style: italic;

  p {
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    margin-bottom: 0.5rem;
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;
