import styled from "styled-components";

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 24px;
  padding-left: 12px;
  height: 48px;
  box-sizing: border-box;

  i {
    color: #aaa;
    margin-right: 8px;
    font-size: 1.2rem;
  }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  background-color: transparent;
  padding: 0 12px 0 0;
`;
