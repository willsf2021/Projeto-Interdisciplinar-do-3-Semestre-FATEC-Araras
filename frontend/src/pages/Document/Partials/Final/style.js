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
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  h2 {
    color: ${({ theme }) => theme.colors.textColor};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    text-align: center;
  }

  .rotulo-preview-section {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 2rem;
    border: 2px dashed #dee2e6;
    min-height: 300px;
    width: 100%;
    max-width: 500px;
  }

  .modelo-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .preview-image {
    max-width: 250px;
    max-height: 200px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .preview-label {
    font-weight: 600;
    color: #495057;
    margin: 0;
    font-size: 1rem;
  }

  .rotulo-config-section {
    background: ${({ theme }) => theme.colors.background || "#f8f9fa"};
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
  }

  .rotulo-config-section h3 {
    color: ${({ theme }) => theme.colors.textColor};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    text-align: center;
  }

  .rotulo-buttons-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }

  .rotulo-btn {
    padding: ${({ theme }) => theme.spacing.md};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    background: white;
    color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    min-height: 60px;
  }

  .rotulo-btn:hover {
    background: #f0f8ff;
    transform: translateY(-2px);
  }

  .rotulo-btn.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  .download-buttons {
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

  .container-control-home {
    width: 100%;
  }

  .container-control-home button {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.grayButton};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    width: 100%;
    height: 48px;
    border: 1px solid ${({ theme }) => theme.colors.grayButton};
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.02);
      background-color: #f0fdf4;
    }

    &:active {
      transform: scale(0.98);
    }

    .rotulo-buttons-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: ${({ theme }) => theme.spacing.md};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      .rotulo-buttons-grid {
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr;
      }
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      .rotulo-buttons-grid {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
      }

      .rotulo-btn {
        min-height: 50px;
        font-size: ${({ theme }) => theme.fontSizes.xs};
        border-radius: ${({ theme }) => theme.borderRadius.xl};
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0px 16px;

    .preview-container {
      min-height: 250px;
      padding: 1.5rem;
    }

    .preview-image {
      max-width: 200px;
      max-height: 150px;
    }

    .rotulo-btn {
      min-height: 50px;
    }
  }
`;
