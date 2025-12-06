import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  overflow-x: hidden;
  
  @media (min-width: 768px) {
    gap: 2rem;
    padding: 20px 0;
  }
  
  @media (min-width: 1024px) {
    gap: 2.5rem;
    padding: 30px 0;
  }
`;

export const IngredientsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
  
  /* Campos de Pesos em desktop - lado a lado */
  .container-pesos {
    @media (min-width: 768px) {
      grid-column: span 2;
      
      fieldset {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        padding: 24px 20px 20px;
        
        legend {
          grid-column: span 3;
        }
        
        div {
          margin: 0;
        }
      }
    }
    
    @media (min-width: 1024px) {
      fieldset {
        gap: 1.5rem;
        padding: 28px 24px 24px;
      }
    }
  }
  
  /* Campos de Custo em desktop - lado a lado */
  fieldset:nth-child(3) {
    @media (min-width: 768px) {
      grid-column: span 2;
      
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 24px 20px 20px;
      
      legend {
        grid-column: span 2;
      }
      
      div {
        margin: 0;
      }
    }
    
    @media (min-width: 1024px) {
      gap: 1.5rem;
      padding: 28px 24px 24px;
    }
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
  
  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.md};
    padding: 1.2rem;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
  
  @media (min-width: 1024px) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    padding: 1.4rem;
    max-width: 350px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const IngredientsListContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  @media (min-width: 768px) {
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding: 0;
  }
`;

export const IngredientsListHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textColorMuted};
  padding: 0 ${({ theme }) => theme.spacing.sm};
  
  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.base};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding: 0;
  }
  
  @media (min-width: 1024px) {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

export const IngredientsListGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  padding-right: ${({ theme }) => theme.spacing.sm};
  max-height: 400px;
  overflow-y: auto;
  
  @media (min-width: 768px) {
    max-height: 500px;
    padding: ${({ theme }) => theme.spacing.md} 0;
    padding-right: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.lg};
  }
  
  @media (min-width: 1024px) {
    max-height: 600px;
    padding-right: ${({ theme }) => theme.spacing.lg};
  }

  /* Scrollbar customizada */
  &::-webkit-scrollbar {
    width: 6px;
    
    @media (min-width: 768px) {
      width: 8px;
    }
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
  
  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    gap: ${({ theme }) => theme.spacing.lg};
    border-left-width: 5px;
  }
  
  @media (min-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.xl};
    gap: ${({ theme }) => theme.spacing.xl};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

export const IngredientItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  
  @media (min-width: 768px) {
    gap: ${({ theme }) => theme.spacing.lg};
  }
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
  
  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1.4rem;
  }
`;

export const IngredientItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (min-width: 768px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const IngredientItemTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm} !important;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fontFamilies.inter};
  text-align: left !important;
  
  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.base} !important;
  }
  
  @media (min-width: 1024px) {
    font-size: ${({ theme }) => theme.fontSizes.md} !important;
  }
`;

export const IngredientItemDescription = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textColorMuted};
  line-height: 1.4;
  
  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.base};
    gap: ${({ theme }) => theme.spacing.md};
  }
  
  @media (min-width: 1024px) {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }

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
  
  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.base};
    gap: ${({ theme }) => theme.spacing.md};
  }
  
  @media (min-width: 1024px) {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    width: 14px;
    height: 14px;
    
    @media (min-width: 768px) {
      width: 16px;
      height: 16px;
    }
  }
`;

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
  
  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  &:hover {
    background: #fee2e2;
  }

  svg {
    color: #dc2626;
    width: 18px;
    height: 18px;
    
    @media (min-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textColorMuted};
  font-style: italic;
  
  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xxl};
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    margin-bottom: 0.5rem;
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.md};
      margin-bottom: 0.75rem;
    }
    
    @media (min-width: 1024px) {
      font-size: ${({ theme }) => theme.fontSizes.lg};
      margin-bottom: 1rem;
    }
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.base};
    }
    
    @media (min-width: 1024px) {
      font-size: ${({ theme }) => theme.fontSizes.md};
    }
  }
`;

/* Novo componente para organizar o layout em desktop */
export const Step2Layout = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: flex-start;
  }
`;

/* Novo componente para a coluna do formulário */
export const FormColumn = styled.div`
  @media (min-width: 1024px) {
    position: sticky;
    top: 20px;
  }
`;

/* Novo componente para a coluna da lista */
export const ListColumn = styled.div`
  @media (min-width: 1024px) {
    height: calc(100vh - 200px);
    overflow-y: auto;
    padding-right: 1rem;
  }
`;