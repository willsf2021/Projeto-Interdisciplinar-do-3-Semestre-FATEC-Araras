import styled from "styled-components";

export const Container = styled.main`
  padding: 0px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 24px;
  height: 100vh;

  .form-header {
    margin: 50px auto 0px auto;
    width: fit-content;
    max-height: fit-content;
    
    h3 {
      color: ${({ theme }) => theme.colors.textColor};
      font-size: ${({ theme }) => theme.fontSizes.lg};
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
      text-align: center;
      margin: 0;
    }
  }

  .step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .step-content-inner {
    flex: 1;
    padding-top: 32px;
  }

  /* Control Buttons - mesmo estilo do Document */
  .control-buttons {
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: flex-end;
    padding-top: 24px;
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

    &:hover:not(:disabled) {
      transform: scale(1.1);
      background-color: #f0fdf4;
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
  }

`;