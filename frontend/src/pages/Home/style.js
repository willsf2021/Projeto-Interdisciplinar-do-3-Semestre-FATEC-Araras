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

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    background-image: url(${bgDesktop});
  }
`;

/* ADICIONE este novo componente: */
export const ScrollContainer = styled.div`
  overflow-y: auto;
  margin-bottom: 24px;
  max-height: 60vh;
`;

/* ADICIONE este novo componente: */
export const FixedBottom = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  right: 24px;
  background: white;
  z-index: 10;
  flex: 1;
`;