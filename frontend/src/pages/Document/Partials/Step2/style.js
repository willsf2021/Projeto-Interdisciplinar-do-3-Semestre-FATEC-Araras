import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  .container-porcoes {
    display: flex;
    gap: 8px;
    label {
      font-size: 0.8rem;
    }
  }
`;

export const InputFlexWrapperStep2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm} 0;
  font-weight: 500;
  
`;

export const TextFieldWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px 0;
  width: 100%;
  color: inherit;
`;

export const TextFieldLabel = styled.label`
  margin-left: 4px;
`;

export const TextField = styled.textarea`
  font: inherit;
  color: inherit;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding: ${({ theme }) => theme.spacing.sm};
  height: 112px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all 300ms ease-in-out;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary + "33"};
    outline: none;
  }

  &:active {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
