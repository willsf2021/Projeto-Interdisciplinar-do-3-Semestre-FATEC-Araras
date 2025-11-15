import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 24px 24px 24px;
  color: white;
  width: 100%;
`;

export const AvatarContainer = styled.div`
  padding-right: 8px;
  font-size: 48px;
  display: flex;

  .avatar-wrapper{
    display: flex;
    position: relative;
    
    .avatar-image{
      width: 46px;
      height: 46px;
      border-radius: 50%;
      overflow: hidden;
      img{
        width: 100%;
      }
    }

    .edit-icon{
      display: flex;
      position: absolute;
      bottom: -5px;
      right: -5px;
      z-index: 2;
      background-color: white;
      color: ${({ theme }) => theme.colors.primary};
      width: min-content;
      max-height: fit-content;
      padding: 2px;
      border-radius: 50%;
      border: 2px solid ${({ theme }) => theme.colors.primary};
    }
  }

`;

export const GreetingMessage = styled.div`
  padding-right: 32px;
  font-size: 14px;
  flex: 1;

  p {
    margin: 0;
  }

  small {
    display: block;
    opacity: 0.9;
  }
`;

export const LogoutContainer = styled.div`
    font-size: 32px;
`;

export const LogoutLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
`;
