import styled from "styled-components";

export const Container = styled.div`
  padding: 0px 24px;
  padding-top: 56px;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 24px;
  height: 100vh;

  header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 16px;
  }

  .step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .step-content-inner {
    flex: 1;
  }

  .profile-image {
    position: relative;
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }

  .profile-image img {
    width: 110px;
    height: 110px;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #00a884;
    position: relative;
    margin-bottom: 25px;
  }

  #imageUpload {
    display: none;
  }

  footer {
    margin-top: 290px;
  }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #333;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    margin-right: 4px;
  }
`;
