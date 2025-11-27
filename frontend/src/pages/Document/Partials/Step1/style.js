import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  overflow-x:hidden;

  .container-porcoes {
    display: flex;
    gap: 8px;
    label {
      font-size: 0.8rem;
    }
  }
`;

export const InputFlexWrapperStep1 = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm} 0;
  font-weight: 500;
`;

export const TextFieldWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px 0;
  width: 100%;
  color: inherit;
`;

export const TextFieldLabel = styled.label`
  margin-left: 4px;
`;

export const TextField = styled.textarea`
  font: inherit;
  color: inherit;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding: ${({ theme }) => theme.spacing.sm};
  height: 112px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all 300ms ease-in-out;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary + "33"};
    outline: none;
  }

  &:active {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-left: 8px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CheckboxCustom = styled.input`
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:checked {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:checked::after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 14px;
    font-weight: bold;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

export const InputWithTooltip = styled.div`
  position: relative;
  width: 100%;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
`;

export const TooltipIcon = styled.span`
  position: absolute;
  top: 2px;
  right: 4px;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  font-size: 12px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  transition: all 0.2s ease;
  user-select: none;
  z-index: 2;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  &:hover > span {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  /* Mobile: mostrar ao tocar */
  @media (hover: none) and (pointer: coarse) {
    &:active > span {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const TooltipText = styled.span`
  visibility: hidden;
  opacity: 0;
  width: 220px;
  background-color: ${({ theme }) => theme.colors.textColor};
  color: white;
  text-align: left;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 10px 12px;
  position: absolute;
  z-index: 1000;
  bottom: calc(100% + 8px);
  right: -10px;
  font-size: 12px;
  line-height: 1.4;
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  white-space: normal;
  word-wrap: break-word;
  transform: translateY(10px);

  /* Seta do tooltip */
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    right: 12px;
    border-width: 6px;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.textColor} transparent transparent transparent;
  }

  /* Ajuste ESPECÍFICO para tooltips no legend - CORREÇÃO DO VAZAMENTO */
  legend & {
    bottom: calc(100% + 12px);
    left: 0;
    right: auto;
    width: 240px;
    
    &::after {
      left: 20px;
      right: auto;
    }
  }

  /* Ajuste para mobile */
  @media (max-width: 768px) {
    width: 200px;
    font-size: 11px;
    padding: 8px 10px;
    
    legend & {
      width: 220px;
      left: -50px;
      right: auto;
      
      &::after {
        left: 60px;
      }
    }
  }
`;