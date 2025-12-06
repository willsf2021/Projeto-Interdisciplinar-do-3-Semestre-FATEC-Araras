import styled from "styled-components";

export const Container = styled.main`
  padding: 0px 24px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  
  @media (min-width: 768px) {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 40px;
    height: auto;
    min-height: 100vh;
    justify-content: center;
  }
  
  @media (min-width: 1024px) {
    max-width: 1000px;
    padding: 0 48px;
  }
  
  @media (min-width: 1200px) {
    max-width: 1100px;
  }

  .final-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    
    @media (min-width: 768px) {
      padding: 2rem 0;
      gap: 3rem;
      overflow-y: visible;
    }
  }

  h2 {
    color: ${({ theme }) => theme.colors.textColor};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    text-align: center;
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.xxl};
      margin-bottom: ${({ theme }) => theme.spacing.lg};
    }
    
    @media (min-width: 1024px) {
      font-size: ${({ theme }) => theme.fontSizes.xxxl || "42px"};
      margin-bottom: ${({ theme }) => theme.spacing.xl};
    }
  }

  .rotulo-preview-section {
    display: flex;
    justify-content: center;
    align-items: center;
    
    @media (min-width: 768px) {
      margin: 0 auto;
    }
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
    
    @media (min-width: 768px) {
      min-height: 350px;
      max-width: 600px;
      padding: 3rem;
      border-width: 3px;
      border-radius: 16px;
    }
    
    @media (min-width: 1024px) {
      min-height: 400px;
      max-width: 700px;
      padding: 4rem;
      border-radius: 20px;
    }
  }

  .modelo-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    
    @media (min-width: 768px) {
      gap: 2rem;
    }
  }

  .preview-image {
    max-width: 250px;
    max-height: 200px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    @media (min-width: 768px) {
      max-width: 350px;
      max-height: 280px;
      border-width: 2px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    
    @media (min-width: 1024px) {
      max-width: 400px;
      max-height: 320px;
      border-radius: 16px;
    }
  }

  .preview-label {
    font-weight: 600;
    color: #495057;
    margin: 0;
    font-size: 1rem;
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.lg};
    }
    
    @media (min-width: 1024px) {
      font-size: ${({ theme }) => theme.fontSizes.xl};
    }
  }

  .rotulo-config-section {
    background: ${({ theme }) => theme.colors.background || "#f8f9fa"};
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    
    @media (min-width: 768px) {
      padding: ${({ theme }) => theme.spacing.xl};
      border-radius: ${({ theme }) => theme.borderRadius.lg};
      border-width: 2px;
    }
    
    @media (min-width: 1024px) {
      padding: ${({ theme }) => theme.spacing.xxl};
      border-radius: ${({ theme }) => theme.borderRadius.xl};
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
    }
  }

  .rotulo-config-section h3 {
    color: ${({ theme }) => theme.colors.textColor};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    text-align: center;
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.xl};
      margin-bottom: ${({ theme }) => theme.spacing.xl};
    }
    
    @media (min-width: 1024px) {
      font-size: ${({ theme }) => theme.fontSizes.xxl};
      margin-bottom: ${({ theme }) => theme.spacing.xxl};
    }
  }

  .rotulo-buttons-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.md};
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: 1fr;
      gap: ${({ theme }) => theme.spacing.lg};
    }
    
    @media (min-width: 1024px) {
      gap: ${({ theme }) => theme.spacing.xl};
    }
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
    
    @media (min-width: 768px) {
      padding: ${({ theme }) => theme.spacing.lg};
      font-size: ${({ theme }) => theme.fontSizes.base};
      min-height: 70px;
      border-width: 3px;
    }
    
    @media (min-width: 1024px) {
      padding: ${({ theme }) => theme.spacing.xl};
      font-size: ${({ theme }) => theme.fontSizes.md};
      min-height: 80px;
      border-radius: ${({ theme }) => theme.borderRadius.xxl || "50px"};
    }

    &:hover {
      background: #f0f8ff;
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &.active {
      background: ${({ theme }) => theme.colors.primary};
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }

  .download-buttons {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    
    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
      gap: ${({ theme }) => theme.spacing.lg};
      margin-top: ${({ theme }) => theme.spacing.xl};
    }
    
    @media (min-width: 1024px) {
      gap: ${({ theme }) => theme.spacing.xl};
      margin-top: ${({ theme }) => theme.spacing.xxl};
    }
    
    button {
      width: 100%;
      
      @media (min-width: 768px) {
        width: auto;
        min-width: 250px;
        flex: 1;
        max-width: 300px;
      }
      
      @media (min-width: 1024px) {
        min-width: 280px;
        max-width: 350px;
      }
    }
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
    
    @media (min-width: 768px) {
      padding: 40px 0 60px 0;
      background: transparent;
      justify-content: center;
    }
  }

  .container-control-home {
    width: 100%;
    
    @media (min-width: 768px) {
      width: auto;
    }
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
    
    @media (min-width: 768px) {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      font-size: 28px;
    }
    
    @media (min-width: 1024px) {
      width: 70px;
      height: 70px;
      font-size: 32px;
    }

    &:hover {
      transform: scale(1.05);
      background-color: #f0fdf4;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  /* Ajustes para telas muito pequenas */
  @media (max-width: 480px) {
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
      font-size: ${({ theme }) => theme.fontSizes.xs};
    }
  }
  
  /* Ajustes para orientação paisagem em mobile */
  @media (max-width: 767px) and (orientation: landscape) {
    .final-content {
      max-height: calc(100vh - 100px);
    }
    
    .preview-container {
      min-height: 200px;
      padding: 1rem;
    }
    
    .preview-image {
      max-width: 180px;
      max-height: 120px;
    }
  }
`;