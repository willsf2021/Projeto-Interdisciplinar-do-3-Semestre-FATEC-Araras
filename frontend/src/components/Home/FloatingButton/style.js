import styled from "styled-components";

export const FloatingBtn = styled.button`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.grayButton};
  border-radius: 50%;
  position: absolute;
  width: 48px;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.grayButton};
  background-color: white;
  bottom: 96px;
  right: 24px;
  z-index: 999;
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
`;
