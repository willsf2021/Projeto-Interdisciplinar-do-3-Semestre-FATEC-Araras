import styled from "styled-components";

export const Container = styled.main`
  padding: 0px 24px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  .final-content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem 0;
  }

  h2 {
    color: ${({ theme }) => theme.colors.textColor};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    text-align: center;
  }

  p {
    color: ${({ theme }) => theme.colors.textColor};
    font-size: ${({ theme }) => theme.fontSizes.base};
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  .document-info {
    background: ${({ theme }) => theme.colors.background || "#f8f9fa"};
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin: ${({ theme }) => theme.spacing.lg} 0;
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
  }

  .document-info p {
    margin: ${({ theme }) => theme.spacing.sm} 0;
    color: ${({ theme }) => theme.colors.textColor};
    font-size: ${({ theme }) => theme.fontSizes.base};
    text-align: left;
  }

  .rotulo-options {
    margin: ${({ theme }) => theme.spacing.xl} 0;
  }

  .rotulo-options h3 {
    color: ${({ theme }) => theme.colors.textColor};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    text-align: center;
  }

  .rotulo-config {
    background: ${({ theme }) => theme.colors.background || "#f8f9fa"};
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
  }

  .rotulo-format h4 {
    color: ${({ theme }) => theme.colors.textColor};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }

  .rotulo-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  .rotulo-btn {
    padding: ${({ theme }) => theme.spacing.md};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    background: white;
    color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }

  .rotulo-btn:hover {
    background: #f0fdf4;
    transform: translateY(-2px);
  }

  .rotulo-btn.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  .rotulo-actions {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }

  .control-buttons {
    flex-shrink: 0;
    display: flex;
    gap: 8px;
    align-items: flex-end;
    padding: 24px 0;
    background: white;
    position: relative;
    z-index: 10;
    margin-top: auto;
  }

  .container-control-home button {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.grayButton};
    border-radius: 50%;
    width: 48px;
    height: 48px;
    border: 1px solid ${({ theme }) => theme.colors.grayButton};
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
      background-color: #f0fdf4;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .container-control-button {
    flex: 1;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    .rotulo-buttons {
      grid-template-columns: 1fr;
    }
    
    padding: 0px 16px;
  }
`;