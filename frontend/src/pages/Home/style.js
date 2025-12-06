import styled from "styled-components";

import bgMobile from "../../assets/images/bg_mobile.svg";
import bgDesktop from "../../assets/images/bg_desktop.svg";

export const HomeContainer = styled.div`
  background: url(${bgMobile}),
    ${({ theme }) => theme.colors.primary} no-repeat center center / cover;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: hidden;
  width: 100%;
  
  @media (min-width: 768px) {
    background: url(${bgDesktop}),
      ${({ theme }) => theme.colors.primary} no-repeat center center / cover;
    align-items: center;
    justify-content: flex-start;
    padding: 40px 24px;
    height: auto;
    min-height: 100vh;
  }
  
  @media (min-width: 1024px) {
    padding: 60px 24px;
    margin: 0 auto;
  }
`;

export const MainSection = styled.section`
  bottom: 0;
  width: auto;
  flex: 1;
  background-color: white;
  border-radius: 24px 24px 0px 0px;
  display: flex;
  flex-direction: column;
  gap: 32px 0px;
  padding: 24px;
  height: 100dvh;
  position: relative;
  
  @media (min-width: 768px) {
    width: 100%;
    max-width: 800px;
    height: auto;
    min-height: calc(100vh - 80px);
    border-radius: 24px;
    padding: 40px;
    gap: 40px 0px;
    margin-top: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (min-width: 1024px) {
    max-width: 900px;
    padding: 48px;
    min-height: calc(100vh - 120px);
  }
`;

export const ScrollContainer = styled.div`
  overflow-y: auto;
  margin-bottom: 24px;
  max-height: calc(90dvh - 240px);
  
  @media (min-width: 768px) {
    max-height: calc(80vh - 320px);
    margin-bottom: 40px;
    padding-right: 8px;
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.primaryLight || '#b3d9ff'};
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.primary || '#1a73e8'};
    }
  }
  
  @media (min-width: 1024px) {
    max-height: calc(70vh - 300px);
  }
`;

export const FixedBottom = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  right: 24px;
  z-index: 10;
  flex: 1;
  
  @media (min-width: 768px) {
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: 40px;
    margin-top: 20px;
  }
  
  @media (min-width: 1024px) {
    gap: 48px;
    margin-top: 30px;
  }
`;