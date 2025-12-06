import styled from "styled-components";

export const SectionFormWrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px 0;
  padding: 88px 24px 72px;
  height: 100dvh;
  width: 100%;

  @media (min-width: 768px) {
    max-width: 480px;
    margin: 0 auto;
    justify-content: center;
    padding: 40px 24px;
    height: auto;
    min-height: 100vh;
  }

  @media (min-width: 1024px) {
    max-width: 500px;
    padding: 60px 24px;
  }
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px 0;

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xl || "32px"};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.xxl || "36px"};
    }
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.colors.textColor};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.base};
    }
  }

  .form-actions label {
    display: flex;
    align-items: flex-end;
    gap: 0 4px;
    
    @media (min-width: 768px) {
      gap: 0 8px;
    }
  }

  .form-actions a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  .form-actions input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    width: 20px;
    height: 20px;
    border: 2px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: 4px;
    display: inline-block;
    position: relative;
    cursor: pointer;
    background-color: transparent;
    transition: all 0.2s ease;
    
    @media (min-width: 768px) {
      width: 22px;
      height: 22px;
    }
  }

  .form-actions input[type="checkbox"]:checked {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const DividerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0 8px;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  .hr {
    background-color: ${({ theme }) => theme.colors.borderColor};
    height: 1px;
    flex: 1;
  }

  span {
    color: ${({ theme }) =>
      theme.colors.textSecondary || theme.colors.borderColor};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.base};
    }
  }
`;

export const SecondaryButton = styled.button`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  background: ${({ theme }) => theme.colors.background || "white"};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 300ms ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0 16px;
  margin-bottom: 72px;
  cursor: pointer;
  
  @media (min-width: 768px) {
    height: 52px;
    margin-bottom: 40px;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) =>
      theme.colors.backgroundHover || "#f9f9f9"};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 20px;
    height: 20px;
    
    @media (min-width: 768px) {
      width: 22px;
      height: 22px;
    }
  }
`;

export const FormFooter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (min-width: 768px) {
    padding-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

export const ActionFooter = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary || theme.colors.textColor};
  
  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  a {
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    transition: color 300ms ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.colors.primaryHover};
    }

    &:visited {
      color: ${({ theme }) => theme.colors.primaryHover};
    }
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  height: fit-content;

  img {
    height: 20px;
    
    @media (min-width: 768px) {
      height: 24px;
    }
    
    @media (min-width: 1024px) {
      height: 28px;
    }
  }

  h1 {
    font-family: ${({ theme }) => theme.fontFamilies.montserrat};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.primary};
    line-height: 1;
    font-size: ${({ theme }) => theme.fontSizes.xl};
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.xxl};
    }
  }
`;

export const InputFlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md} 0;
  
  @media (min-width: 768px) {
    gap: ${({ theme }) => theme.spacing.lg} 0;
  }
`;

export const Fieldset = styled.fieldset`
  gap: 8px;
  padding: 20px 16px 16px;
  border: 1px solid #d0d0d0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  position: relative;
  
  label {
    font-size: 0.8rem;
    max-width: 102px;
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.sm};
    }
  }
`;

export const FieldsetLegend = styled.legend`
  padding: 0 8px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  align-items: center;
  gap: 6px;
  
  .legend-tooltip {
    position: relative;
    top: 0;
    right: 0;
  }
`;