import styled from "styled-components";

export const Container = styled.main`
  padding: 0px 24px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* Impede scroll global */

  .container-steps {
    margin: 50px auto 0px auto;
    width: fit-content;
    max-height: fit-content;
    flex-shrink: 0; /* Impede que encolha */
  }

  .container-steps ul {
    display: flex;
    align-items: center;
    max-width: 384px;
    gap: 8px;
    padding: 20px 0px 32px;
    list-style: none;
    margin: 0;
  }

  .steps-item-container {
    position: relative;
  }

  .steps-item-container p {
    position: absolute;
    padding-top: 8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: ${({ theme }) => theme.fontSizes.base};
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
    color: #9ca3af;
    opacity: 0;
  }

  .steps-item-container p.p-active {
    color: ${({ theme }) => theme.colors.textColor};
    font-weight: 600;
    opacity: 1;
  }

  .hr-steps {
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    max-width: 100%;
    min-width: 24px;
  }

  .span-container {
    position: relative;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 48px;
    width: 48px;
    padding: 3px;
    transition: all 0.3s ease;
  }

  .steps-items-span {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    position: relative;
    z-index: 1;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.primary};
  }

  .steps-items-span.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    font-weight: 500;
  }

  .step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Container não scrolla */
    position: relative;
  }

  .step-content-inner {
    flex: 1;
    overflow-y: auto; /* Só o conteúdo interno scrolla */
    padding-bottom: 20px; /* Espaço para não cortar conteúdo */
  }

  .control-buttons {
    flex-shrink: 0; /* Impede que os controles encolham */
    display: flex;
    gap: 8px;
    align-items: flex-end;
    padding: 24px 0;
    background: white; /* Fundo sólido para sobrepor conteúdo */
    position: relative;
    z-index: 10;
    margin-top: auto; /* Garante que fique na base */
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
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .container-control-home button:hover {
    background-color: #f0fdf4;
  }

  .container-control-home button i {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.primary};
  }

  .container-control-button {
    flex: 1;
  }

  .container-control-button button {
    height: 48px;
    width: 100%;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.colors.primaryLinear},
      ${({ theme }) => theme.colors.primary}
    );
    border: none;
    color: white;
    font-size: 16px;
    font-weight: 400;
    border-radius: 40px;
    transition: all 300ms ease-in-out;
    cursor: pointer;
  }

  .container-control-button button:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  .container-control-button button.prev-step {
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textColor};
  }

  .container-control-button button.prev-step:hover {
    background: #f0fdf4;
  }

  .container-control-button button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Garante que em telas muito pequenas ainda funcione */
  @media (max-height: 600px) {
    .container-steps {
      margin: 20px auto 0px auto;
    }
    
    .container-steps ul {
      padding: 10px 0px 20px;
    }
    
    .step-content-inner {
      padding-bottom: 10px;
    }
    
    .control-buttons {
      padding: 16px 0;
    }
  }
`;