import React from "react";
import { SearchContainer, SearchInput } from "./style";

export const SearchBar = ({ placeholder = "Buscar..." }) => {
  return (
    <SearchContainer>
      <i className="bi bi-search" />
      <SearchInput type="text" placeholder={placeholder} />
    </SearchContainer>
  );
};

