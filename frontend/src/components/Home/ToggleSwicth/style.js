import styled from "styled-components";

export const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`;

export const Toggle = styled.div`
  position: relative;
  display: flex;
  min-height: 56px;
  /* COLOQUE SUA COR DE FUNDO AQUI - #44a89e ou var(--primary-color) */
  background-color: #44a89e;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
  padding: 6px;
`;

export const ToggleOption = styled.button`
  flex: 1;
  border: none;
  background: none;
  /* COLOQUE SUA COR AQUI - white quando ativo, senão white também */
  color: ${(props) => (props.$active ? "#44a89e" : "white")};
  font-weight: 600;
  cursor: pointer;
  z-index: 2;
  transition: color 0.3s;
  font-size: 16px;
`;

export const Slider = styled.div`
  position: absolute;
  top: 4px;
  width: calc(50% - 6px);
  height: calc(100% - 8px);
  background-color: white;
  border-radius: 999px;
  transition: transform 0.3s ease;
  z-index: 1;
  transform: translateX(${(props) => props.activeIndex * 100}%);
`;
