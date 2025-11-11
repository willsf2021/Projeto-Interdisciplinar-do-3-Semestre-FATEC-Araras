import styled from "styled-components";
import bgMobile from "../../assets/images/bg_mobile.svg";
import bgDesktop from "../../assets/images/bg_desktop.svg";

export const Container = styled.div`
  height: 100%;
  background: url(${bgMobile}),
    ${({ theme }) => theme.colors.primary} no-repeat center center / cover;

  display: flex;
  align-items: center;
  justify-content: center;

  @keyframes fadeInOut {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  #logo-splash {
    animation: fadeInOut 2s ease-in-out infinite;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    background-image: url(${bgDesktop});
  }
`;
