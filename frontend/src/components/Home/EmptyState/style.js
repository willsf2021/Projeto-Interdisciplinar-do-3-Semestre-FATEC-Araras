import styled from "styled-components";

export const EmptyStateContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  
  p {
    line-height: 1.6;
  }
`;

export const HighlightText = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;
