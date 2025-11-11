import styled from "styled-components";

export const Container = styled.div`
  padding: 0px 24px;
  padding-top: 56px;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 24px;
  height: 100vh;

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
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
  }

  .profile-image img {
    width: 110px;
    height: 110px;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid #00a884;
    position: relative;
    margin-bottom: 25px;
  }

  #imageUpload {
    display: none;
  }
  
`;
