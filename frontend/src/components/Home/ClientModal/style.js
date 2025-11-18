// components/Home/ClientModal/style.js
import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const EditModal = styled.div`
  background: white;
  padding: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease-out;

  h3 {
    color: ${({ theme }) => theme.colors.textColor};
    margin-bottom: 16px;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    text-align: center;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }

  .input-container {
    margin: 20px 0;
  }

  .error-message {
    color: #e74c3c;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-top: 8px;
    text-align: center;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }

  @keyframes modalAppear {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;

  .cancel-btn,
  .confirm-btn {
    padding: 12px 24px;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    cursor: pointer;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    font-size: ${({ theme }) => theme.fontSizes.base};
    transition: all 0.3s ease;
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .cancel-btn {
    background: ${({ theme }) => theme.colors.grayButton};
    color: white;

    &:hover:not(:disabled) {
      background: #2a2a2a;
      transform: translateY(-1px);
    }
  }

  .confirm-btn {
    background: ${({ theme }) => theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
      transform: translateY(-1px);
    }
  }

  .cancel-btn:disabled,
  .confirm-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  .button-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;