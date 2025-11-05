import styled, { keyframes, css } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;

  .select-container {
    flex: 1;
  }

  .btn-add-client {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: 24px;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: 500;
    transition: all 0.3s ease;
    white-space: nowrap;
    height: 48px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryDark};
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .btn-icon {
      font-size: ${({ theme }) => theme.fontSizes.base};
    }
  }
`;

export const SelectContainer = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.3s ease-out;

  &.select-enter {
    animation: ${fadeIn} 0.3s ease-out;
  }
`;