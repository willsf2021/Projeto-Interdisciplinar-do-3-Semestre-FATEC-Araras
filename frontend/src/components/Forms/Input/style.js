import styled from "styled-components";

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px 0;
  width: 100%;
  color: inherit;
`;

export const InputLabel = styled.label`
  margin-left: 4px;
`;

export const InputField = styled.input`
  font: inherit;
  color: inherit;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding-left: ${({ theme }) => theme.spacing.md};
  height: 48px;
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

export const ToggleButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(25%);
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.base};

  svg {
    color: ${({ theme, isFocused }) =>
      isFocused ? theme.colors.primary : theme.colors.borderColor};
    transition: color 0.3s;
  }
`;
