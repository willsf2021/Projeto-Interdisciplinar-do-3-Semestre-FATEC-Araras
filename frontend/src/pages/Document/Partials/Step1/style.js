import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  overflow-x: hidden;
  
  @media (min-width: 768px) {
    gap: 2rem;
    padding: 20px 0;
  }
  
  @media (min-width: 1024px) {
    gap: 2.5rem;
    padding: 30px 0;
  }

  .container-porcoes {
    display: flex;
    gap: 8px;
    
    @media (min-width: 768px) {
      gap: 16px;
      align-items: center;
    }
    
    label {
      font-size: 0.8rem;
      max-width: 80px;
      
      @media (min-width: 768px) {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        max-width: 100px;
      }
      
      @media (min-width: 1024px) {
        font-size: ${({ theme }) => theme.fontSizes.base};
      }
    }
  }
`;

export const InputFlexWrapperStep1 = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm} 0;
  font-weight: 500;
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  }
  
  /* Campos que devem ocupar 2 colunas */
  .full-width {
    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }
  
  /* Campos de porção que devem ficar lado a lado */
  .porcao-field {
    @media (min-width: 768px) {
      display: flex;
      flex-direction: column;
    }
  }
`;

export const TextFieldWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px 0;
  width: 100%;
  color: inherit;
  
  @media (min-width: 768px) {
    gap: 8px 0;
  }
`;

export const TextFieldLabel = styled.label`
  margin-left: 4px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.base};
    margin-left: 8px;
    font-weight: 500;
  }
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
  resize: vertical;
  
  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
    height: 140px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    min-height: 140px;
    max-height: 200px;
  }
  
  @media (min-width: 1024px) {
    height: 160px;
    min-height: 160px;
    max-height: 250px;
    padding: ${({ theme }) => theme.spacing.lg};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary + "33"};
    outline: none;
  }

  &:active {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  
  @media (min-width: 768px) {
    grid-column: span 2;
    margin-bottom: 16px;
    padding: 8px 0;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-left: 8px;
  
  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.base};
    margin-left: 12px;
  }
  
  @media (min-width: 1024px) {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
  
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
  
  @media (min-width: 768px) {
    width: 24px;
    height: 24px;
  }

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
    
    @media (min-width: 768px) {
      font-size: 16px;
    }
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
  
  @media (min-width: 768px) {
    &.field-markup {
      max-width: 200px;
    }
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
  
  @media (min-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 13px;
    top: 4px;
    right: 8px;
  }
  
  @media (min-width: 1024px) {
    width: 22px;
    height: 22px;
    font-size: 14px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: scale(1.1);
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

export const TooltipIconSpecific = styled.span`
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
  
  @media (min-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 13px;
  }
  
  @media (min-width: 1024px) {
    width: 22px;
    height: 22px;
    font-size: 14px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: scale(1.1);
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
  
  @media (min-width: 768px) {
    width: 280px;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    padding: 12px 16px;
    bottom: calc(100% + 10px);
    right: -20px;
  }
  
  @media (min-width: 1024px) {
    width: 320px;
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  /* Seta do tooltip */
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    right: 12px;
    border-width: 6px;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.textColor} transparent transparent transparent;
    
    @media (min-width: 768px) {
      right: 20px;
    }
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
    
    @media (min-width: 768px) {
      width: 300px;
      bottom: calc(100% + 15px);
      
      &::after {
        left: 30px;
      }
    }
  }

  /* Ajuste para mobile */
  @media (max-width: 767px) {
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

/* Adicione estes novos componentes para melhor organização em desktop */
export const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.5rem;
    align-items: flex-end;
  }
  
  @media (min-width: 1024px) {
    gap: 2rem;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  
  @media (min-width: 768px) {
    min-width: 0; /* Permite que os campos encolham se necessário */
  }
`;

export const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.textColor};
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    margin: 0 0 1.5rem 0;
  }
  
  @media (min-width: 1024px) {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    margin: 0 0 2rem 0;
  }
`;