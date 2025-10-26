import styled from "styled-components";

export const SectionFormWrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px 0;
  padding: 88px 24px 72px;
  height: 100dvh;
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px 0;

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xl || "32px"};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.colors.textColor};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  .form-actions label {
    display: flex;
    align-items: flex-end;
    gap: 0 4px;
  }

  .form-actions a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
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

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) =>
      theme.colors.backgroundHover || "#f9f9f9"};
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

export const InnerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const FormFooter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const ActionFooter = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary || theme.colors.textColor};

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
  }

  h1 {
    font-family: ${({ theme }) => theme.fontFamilies.montserrat};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.primary};
    line-height: 0%;
  }
`;

export const InputFlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md} 0;
`;
