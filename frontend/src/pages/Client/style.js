import styled from "styled-components";

export const Container = styled.main`
  padding: 0px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 24px;
  height: 100vh;
  
  @media (min-width: 768px) {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 40px;
    height: auto;
    min-height: 100vh;
    justify-content: center;
  }
  
  @media (min-width: 1024px) {
    max-width: 700px;
    padding: 0 48px;
  }

  .form-header {
    margin: 50px auto 0px auto;
    width: fit-content;
    max-height: fit-content;
    
    @media (min-width: 768px) {
      margin: 60px auto 0px auto;
    }
    
    @media (min-width: 1024px) {
      margin: 80px auto 0px auto;
    }
    
    h3 {
      color: ${({ theme }) => theme.colors.textColor};
      font-size: ${({ theme }) => theme.fontSizes.lg};
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
      text-align: center;
      margin: 0;
      
      @media (min-width: 768px) {
        font-size: ${({ theme }) => theme.fontSizes.xl};
      }
      
      @media (min-width: 1024px) {
        font-size: ${({ theme }) => theme.fontSizes.xxl};
      }
    }
  }

  form {
    @media (min-width: 768px) {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 40px 32px 32px;
      background: white;
      margin-top: 40px;
    }
    
    @media (min-width: 1024px) {
      padding: 48px 40px 40px;
      border-radius: 20px;
      margin-top: 60px;
    }
  }

  .step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    
    @media (min-width: 768px) {
      overflow-y: visible;
    }
  }

  .step-content-inner {
    flex: 1;
    padding-top: 32px;
    
    @media (min-width: 768px) {
      padding-top: 24px;
    }
    
    @media (min-width: 1024px) {
      padding-top: 32px;
    }
  }

  /* Control Buttons - mesmo estilo do Document */
  .control-buttons {
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: flex-end;
    padding-top: 24px;
    
    @media (min-width: 768px) {
      padding: 32px 0 40px 0;
      gap: 16px;
    }
    
    @media (min-width: 1024px) {
      padding: 40px 0 48px 0;
      gap: 24px;
    }
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
    cursor: pointer;
    
    @media (min-width: 768px) {
      width: 56px;
      height: 56px;
      font-size: 28px;
    }
    
    @media (min-width: 1024px) {
      width: 60px;
      height: 60px;
      font-size: 30px;
    }

    &:hover:not(:disabled) {
      transform: scale(1.1);
      background-color: #f0fdf4;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .container-control-button {
    flex: 1;
    
    button {
      @media (min-width: 768px) {
        height: 56px;
        font-size: 18px;
        font-weight: 500;
      }
      
      @media (min-width: 1024px) {
        height: 60px;
        font-size: 20px;
      }
    }
  }

  /* Ajustes para formulário em desktop */
  @media (min-width: 768px) {
    .form-header {
      text-align: center;
      
      h3 {
        text-align: center;
        width: 100%;
      }
    }
    
    .step-content-inner {
      display: flex;
      flex-direction: column;
      gap: 24px;
      
      @media (min-width: 1024px) {
        gap: 32px;
      }
    }
    
    /* Botão de submit com efeitos melhorados para desktop */
    .container-control-button button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  /* Ajustes para telas muito pequenas */
  @media (max-height: 600px) {
    .form-header {
      margin: 20px auto 0px auto;
    }
    
    .step-content-inner {
      padding-top: 20px;
    }
    
    .control-buttons {
      padding-top: 16px;
    }
  }
  
  /* Ajustes para orientação paisagem em mobile */
  @media (max-width: 767px) and (orientation: landscape) {
    .form-header {
      margin: 20px auto 0px auto;
    }
    
    .step-content {
      max-height: 70vh;
    }
  }
`;