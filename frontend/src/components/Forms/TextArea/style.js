import styled from "styled-components";

export const TextAreaWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px 0;
  width: 100%;
  height: 100%;
  color: inherit;
`;

export const TextAreaLabel = styled.label`
  margin-left: 4px;
  font-weight: 500;
`;

export const TextField = styled.textarea`
  font: inherit;
  color: inherit;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all 300ms ease-in-out;
  width: 100%;
  height: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary + "33"};
    outline: none;
  }

  &:active {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
