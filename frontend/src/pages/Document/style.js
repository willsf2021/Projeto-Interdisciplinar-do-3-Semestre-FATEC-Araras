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
  }

  @media (min-width: 1024px) {
    max-width: 1000px;
    padding: 0 48px;
  }

  @media (min-width: 1200px) {
    max-width: 1100px;
  }

  .container-steps {
    margin: 50px auto 0px auto;
    width: fit-content;
    max-height: fit-content;
    flex-shrink: 0;

    @media (min-width: 768px) {
      margin: 60px auto 0px auto;
      width: 100%;
    }

    @media (min-width: 1024px) {
      margin: 80px auto 0px auto;
    }
  }

  .container-steps ul {
    display: flex;
    align-items: center;
    max-width: 384px;
    gap: 8px;
    padding: 20px 0px 32px;
    list-style: none;
    margin: auto;

    @media (min-width: 768px) {
      max-width: 600px;
      gap: 16px;
      padding: 24px 0px 40px;
    }

    @media (min-width: 1024px) {
      max-width: 700px;
      gap: 20px;
      padding: 32px 0px 48px;
    }
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

    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.md};
      opacity: 1;
      color: #9ca3af;
      font-weight: normal;
    }

    @media (min-width: 1024px) {
      font-size: ${({ theme }) => theme.fontSizes.lg};
      padding-top: 12px;
    }
  }

  .steps-item-container p.p-active {
    color: ${({ theme }) => theme.colors.textColor};
    font-weight: 600;
    opacity: 1;

    @media (min-width: 768px) {
      font-weight: 700;
    }
  }

  .hr-steps {
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    max-width: 100%;
    min-width: 24px;

    @media (min-width: 768px) {
      min-width: 40px;
      height: 3px;
    }

    @media (min-width: 1024px) {
      min-width: 60px;
    }
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

    @media (min-width: 768px) {
      height: 56px;
      width: 56px;
    }

    @media (min-width: 1024px) {
      height: 64px;
      width: 64px;
    }
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
    font-size: ${({ theme }) => theme.fontSizes.base};

    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.lg};
      font-weight: 600;
    }

    @media (min-width: 1024px) {
      font-size: ${({ theme }) => theme.fontSizes.xl};
    }
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
    overflow: hidden;
    position: relative;

    @media (min-width: 768px) {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 0 24px;
      margin-bottom: 40px;
      background: white;
    }

    @media (min-width: 1024px) {
      padding: 0 32px;
      border-radius: 20px;
      margin-bottom: 60px;
    }
  }

  .step-content-inner {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 20px;

    @media (min-width: 768px) {
      padding: 24px 0;
      max-height: calc(80vh - 200px);
      
      &::-webkit-scrollbar {
        width: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.primaryLight || '#b3d9ff'};
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.colors.primary || '#1a73e8'};
      }
    }

    @media (min-width: 1024px) {
      padding: 32px 0;
      max-height: calc(80vh - 240px);
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
      gap: 16px;
      padding: 32px 0 40px 0;
      background: transparent;
    }

    @media (min-width: 1024px) {
      gap: 24px;
      padding: 40px 0 48px 0;
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

  .container-control-button button:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .container-control-button button.prev-step {
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textColor};

    &:hover {
      background: #f0fdf4;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .container-control-button button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

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

  @media (max-width: 767px) and (orientation: landscape) {
    .container-steps {
      margin: 20px auto 0px auto;
    }
    
    .container-steps ul {
      padding: 10px 0px 20px;
    }
    
    .step-content-inner {
      max-height: 50vh;
    }
  }
`;