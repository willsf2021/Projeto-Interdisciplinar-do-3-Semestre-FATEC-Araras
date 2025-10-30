// components/Home/CustomSelect/style.js
import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  font-family: ${props => 
    props.variant === 'modern' ? '"Inter", sans-serif' : 'inherit'};

  ${props => props.variant === 'modern' && `
    .react-select__control {
      border-radius: 12px;
      border: 2px solid #e5e7eb;
      min-height: 48px;
      transition: all 0.2s;
    }
    
    .react-select__control--menu-open {
      border-color: #3ea896;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  `}
`;