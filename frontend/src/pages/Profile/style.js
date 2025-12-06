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
  
  @media (min-width: 768px) {
    max-width: 700px;
    margin: 0 auto;
    padding: 80px 40px 40px;
    height: auto;
    min-height: 100vh;
    justify-content: center;
  }
  
  @media (min-width: 1024px) {
    max-width: 800px;
    padding: 100px 48px 48px;
  }

  header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 16px;
    
    @media (min-width: 768px) {
      position: absolute;
      top: 40px;
      left: 40px;
      margin-bottom: 0;
    }
    
    @media (min-width: 1024px) {
      top: 48px;
      left: 48px;
    }
  }

  .profile-image {
    position: relative;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    
    @media (min-width: 768px) {
      margin-top: 0;
    }

    #avatar-wrapper {
      position: relative;
      cursor: pointer;
      
      @media (min-width: 768px) {
        &:hover .edit-icon {
          transform: scale(1.1);
          background-color: ${({ theme }) => theme.colors.primary};
          color: white;
        }
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
        
        @media (min-width: 768px) {
          padding: 8px;
          font-size: 18px;
          bottom: 5px;
          right: 5px;
        }
        
        @media (min-width: 1024px) {
          padding: 10px;
          font-size: 20px;
          bottom: 8px;
          right: 8px;
        }
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
    
    @media (min-width: 768px) {
      width: 150px;
      height: 150px;
    }
    
    @media (min-width: 1024px) {
      width: 180px;
      height: 180px;
    }

    ${(props) =>
      !props.disabled &&
      `
      @media (min-width: 768px) {
        &:hover {
          transform: scale(1.05);
        }
      }
    `}
  }

  #imageUpload {
    display: none;
  }

  .user-info {
    margin: 32px 0;
    text-align: center;
    
    @media (min-width: 768px) {
      margin: 40px 0;
    }
    
    @media (min-width: 1024px) {
      margin: 48px 0;
    }
    
    h2 {
      font-size: ${({ theme }) => theme.fontSizes.lg};
      color: ${({ theme }) => theme.colors.textColor};
      margin-bottom: 24px;
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
      
      @media (min-width: 768px) {
        font-size: ${({ theme }) => theme.fontSizes.xl};
        margin-bottom: 32px;
      }
      
      @media (min-width: 1024px) {
        font-size: ${({ theme }) => theme.fontSizes.xxl};
      }
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 300px;
      margin: 0 auto;
      
      @media (min-width: 768px) {
        max-width: 500px;
        gap: 20px;
      }
      
      @media (min-width: 1024px) {
        max-width: 600px;
        gap: 24px;
      }
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
      
      @media (min-width: 768px) {
        padding: 16px 0;
      }

      .label {
        font-weight: ${({ theme }) => theme.fontWeights.medium};
        color: ${({ theme }) => theme.colors.textColor};
        font-size: ${({ theme }) => theme.fontSizes.base};
        
        @media (min-width: 768px) {
          font-size: ${({ theme }) => theme.fontSizes.md};
        }
        
        @media (min-width: 1024px) {
          font-size: ${({ theme }) => theme.fontSizes.lg};
        }
      }

      .value {
        color: ${({ theme }) => theme.colors.textColorMuted};
        font-size: ${({ theme }) => theme.fontSizes.base};
        
        @media (min-width: 768px) {
          font-size: ${({ theme }) => theme.fontSizes.md};
        }
        
        @media (min-width: 1024px) {
          font-size: ${({ theme }) => theme.fontSizes.lg};
        }
      }
    }
  }

  .actions-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: auto;
    padding-bottom: 40px;
    
    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
      gap: 24px;
      margin-top: 40px;
      padding-bottom: 60px;
    }
    
    @media (min-width: 1024px) {
      gap: 32px;
      margin-top: 48px;
    }
    
    button {
      @media (min-width: 768px) {
        min-width: 200px;
      }
      
      @media (min-width: 1024px) {
        min-width: 220px;
        height: 56px;
        font-size: ${({ theme }) => theme.fontSizes.md} !important;
      }
    }
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
    
    @media (min-width: 768px) {
      padding: 40px;
    }
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
    
    @media (min-width: 768px) {
      padding: 32px;
      max-width: 500px;
      border-radius: ${({ theme }) => theme.borderRadius.xl};
    }
    
    @media (min-width: 1024px) {
      padding: 40px;
      max-width: 550px;
    }
  }

  .edit-modal h3,
  .delete-modal h3 {
    color: ${({ theme }) => theme.colors.textColor};
    margin-bottom: 16px;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    text-align: center;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.xl};
      margin-bottom: 20px;
    }
    
    @media (min-width: 1024px) {
      font-size: ${({ theme }) => theme.fontSizes.xxl};
    }
  }

  .edit-modal p,
  .delete-modal p {
    text-align: center;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.colors.textColorMuted};
    line-height: 1.5;
    font-size: ${({ theme }) => theme.fontSizes.base};
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.md};
      margin-bottom: 24px;
    }
    
    @media (min-width: 1024px) {
      font-size: ${({ theme }) => theme.fontSizes.lg};
    }
  }

  .input-container {
    margin: 20px 0;
    
    @media (min-width: 768px) {
      margin: 24px 0;
    }
  }

  .consequences {
    background: #f8f9fa;
    padding: 16px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin: 20px 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    
    @media (min-width: 768px) {
      padding: 20px;
      font-size: ${({ theme }) => theme.fontSizes.base};
      margin: 24px 0;
    }
    
    @media (min-width: 1024px) {
      padding: 24px;
    }
  }

  .consequences p {
    margin: 8px 0;
    text-align: left;
    color: ${({ theme }) => theme.colors.textColorMuted};
    
    @media (min-width: 768px) {
      margin: 10px 0;
      font-size: ${({ theme }) => theme.fontSizes.base};
    }
  }

  .confirmation-input {
    margin: 25px 0;
    
    @media (min-width: 768px) {
      margin: 30px 0;
    }
  }

  .confirmation-input label {
    display: block;
    margin-bottom: 10px;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.textColor};
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.base};
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.md};
      margin-bottom: 12px;
    }
    
    @media (min-width: 1024px) {
      font-size: ${({ theme }) => theme.fontSizes.lg};
    }
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
    
    @media (min-width: 768px) {
      padding: 16px 20px;
      font-size: ${({ theme }) => theme.fontSizes.md};
      border-radius: ${({ theme }) => theme.borderRadius.lg};
    }
    
    @media (min-width: 1024px) {
      padding: 18px 24px;
      font-size: ${({ theme }) => theme.fontSizes.lg};
    }

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
    
    @media (min-width: 768px) {
      font-size: ${({ theme }) => theme.fontSizes.base};
      margin-top: 10px;
    }
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
    
    @media (min-width: 768px) {
      gap: 16px;
      margin-top: 32px;
    }
    
    @media (min-width: 1024px) {
      gap: 20px;
    }
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
    
    @media (min-width: 768px) {
      padding: 16px 32px;
      font-size: ${({ theme }) => theme.fontSizes.md};
      border-radius: ${({ theme }) => theme.borderRadius.lg};
      min-width: 140px;
    }
    
    @media (min-width: 1024px) {
      padding: 18px 36px;
      font-size: ${({ theme }) => theme.fontSizes.lg};
      min-width: 160px;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .cancel-btn {
    background: ${({ theme }) => theme.colors.grayButton};
    color: white;

    &:hover:not(:disabled) {
      background: #2a2a2a;
    }
  }

  .confirm-btn {
    background: ${({ theme }) => theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  .delete-btn {
    background: #e74c3c;
    color: white;

    &:hover:not(:disabled) {
      background: #c0392b;
    }
  }

  .cancel-btn:disabled,
  .confirm-btn:disabled,
  .delete-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  .button-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    
    @media (min-width: 768px) {
      width: 20px;
      height: 20px;
    }
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
  padding: 8px;
  border-radius: 50%;
  
  @media (min-width: 768px) {
    padding: 12px;
    background: rgba(0, 0, 0, 0.05);
    
    &:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    margin-right: 4px;
    width: 32px;
    height: 32px;
    
    @media (min-width: 768px) {
      width: 28px;
      height: 28px;
    }
  }
`;