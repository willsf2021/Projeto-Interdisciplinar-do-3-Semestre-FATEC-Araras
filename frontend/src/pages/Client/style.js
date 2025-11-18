import styled from "styled-components";

export const Container = styled.section`
  padding: 0px 24px;
  padding-top: 56px;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 24px;
  height: 100vh;

  .step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .step-content-inner {
    flex: 1;
  }

  .submit-button-container {
    margin-top: auto;
    padding: 24px 0;
  }

  .home-button-container {
    display: flex;
    justify-content: center;
    padding: 16px 0;
  }

  .home-button {
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
`;
