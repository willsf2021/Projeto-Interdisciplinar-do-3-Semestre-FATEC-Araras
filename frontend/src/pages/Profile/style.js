import styled from "styled-components";

export const Container = styled.div`
  padding: 0px 24px;
  padding-top: 56px;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 24px;
  height: 100vh;
  position: relative;

  header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 16px;
  }

  .profile-image {
    position: relative;
    margin-top: 20px;
    display: flex;
    justify-content: center;

    #avatar-wrapper {
      position: relative;
      cursor: pointer;

      &:hover .edit-icon {
        transform: scale(1.1);
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
      }

      .edit-icon {
        display: flex;
        position: absolute;
        bottom: 0px;
        right: 0px;
        z-index: 2;
        background-color: white;
        color: ${({ theme }) => theme.colors.primary};
        width: min-content;
        max-height: fit-content;
        padding: 6px;
        border-radius: 50%;
        border: 2px solid ${({ theme }) => theme.colors.primary};
        font-size: 16px;
        transition: all 0.3s ease;
      }

      .upload-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;

        .spinner-container {
          display: flex;
          align-items: center;
          justify-content: center;

          .spinner {
            width: 30px;
            height: 30px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
        }
      }
    }
  }

  .profile-image img {
    width: 110px;
    height: 110px;
    object-fit: cover;
    border-radius: 50%;
    position: relative;
    transition: transform 0.3s ease;

    ${(props) =>
      !props.disabled &&
      `
      &:hover {
        transform: scale(1.05);
      }
    `}
  }

  #imageUpload {
    display: none;
  }

  .user-info {
    margin: 32px 0;
    text-align: center;
    
    h2 {
      font-size: ${({ theme }) => theme.fontSizes.lg};
      color: ${({ theme }) => theme.colors.textColor};
      margin-bottom: 24px;
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 300px;
      margin: 0 auto;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};

      .label {
        font-weight: ${({ theme }) => theme.fontWeights.medium};
        color: ${({ theme }) => theme.colors.textColor};
        font-size: ${({ theme }) => theme.fontSizes.base};
      }

      .value {
        color: ${({ theme }) => theme.colors.textColorMuted};
        font-size: ${({ theme }) => theme.fontSizes.base};
      }
    }
  }

  .actions-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: auto;
    padding-bottom: 40px;
  }

  /* Modal Styles */
  .modal-overlay {
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
  }

  .edit-modal,
  .delete-modal {
    background: white;
    padding: 24px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    max-width: 450px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: modalAppear 0.3s ease-out;
  }

  .edit-modal h3,
  .delete-modal h3 {
    color: ${({ theme }) => theme.colors.textColor};
    margin-bottom: 16px;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    text-align: center;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }

  .edit-modal p,
  .delete-modal p {
    text-align: center;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.colors.textColorMuted};
    line-height: 1.5;
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  .input-container {
    margin: 20px 0;
  }

  .consequences {
    background: #f8f9fa;
    padding: 16px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin: 20px 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
  }

  .consequences p {
    margin: 8px 0;
    text-align: left;
    color: ${({ theme }) => theme.colors.textColorMuted};
  }

  .confirmation-input {
    margin: 25px 0;
  }

  .confirmation-input label {
    display: block;
    margin-bottom: 10px;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.textColor};
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  .confirmation-input input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.fontSizes.base};
    transition: border-color 0.3s ease;
    text-align: center;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    letter-spacing: 1px;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }

    &:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
    }
  }

  .error-message {
    color: #e74c3c;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-top: 8px;
    text-align: center;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
  }

  .cancel-btn,
  .confirm-btn,
  .delete-btn {
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

  .delete-btn {
    background: #e74c3c;
    color: white;

    &:hover:not(:disabled) {
      background: #c0392b;
      transform: translateY(-1px);
    }
  }

  .cancel-btn:disabled,
  .confirm-btn:disabled,
  .delete-btn:disabled {
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

  /* Loading state para inputs */
  input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Loading state para botões */
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textColor};
  transition: color 0.2s ease;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    margin-right: 4px;
  }
`;