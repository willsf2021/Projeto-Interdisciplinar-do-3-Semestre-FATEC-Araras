import styled from "styled-components";

export const Container = styled.div`
  padding: 0px 24px;
  padding-top: 56px;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 24px;
  height: 100vh;

  header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 16px;
  }

  .step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .step-content-inner {
    flex: 1;
  }

  .profile-image {
    position: relative;
    margin-top: 50px;
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

    ${props => !props.disabled && `
      &:hover {
        transform: scale(1.05);
      }
    `}
  }

  #imageUpload {
    display: none;
  }

  footer {
    margin-top: 290px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  color: #333;
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