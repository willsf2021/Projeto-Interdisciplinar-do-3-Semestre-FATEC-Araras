import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  overflow-x: hidden;
`;

export const PesoFieldset = styled.fieldset`
  display: flex;
  gap: 8px;
  label {
    font-size: 0.7rem;
  }
  padding: 20px 16px 16px;
  border: 1px solid #d0d0d0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  position: relative;
`;

export const FieldsetLegend = styled.legend`
  padding: 0 8px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  align-items: center;
  gap: 6px;
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

export const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textColor};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ConditionalFields = styled.div`
  grid-column: 1 / -1;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: #f9f9f9;
  margin-top: 0.5rem;
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

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

export const IngredientsList = styled.div`
  margin-top: 2rem;
`;

export const IngredientCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1.25rem;
  background: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const IngredientHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const IngredientName = styled.h5`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textColor};
  margin: 0;
  flex: 1;
`;

export const IngredientDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
`;

export const IngredientMeta = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textColor};

  strong {
    color: ${({ theme }) => theme.colors.textColor};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: #fee2e2;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${({ theme }) => theme.colors.textColorMuted};

  p {
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    margin-bottom: 0.5rem;
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-style: italic;
  }
`;
