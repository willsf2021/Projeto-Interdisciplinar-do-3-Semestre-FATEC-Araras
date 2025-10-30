// components/Home/CustomSelect/index.jsx
import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { Search } from "react-bootstrap-icons";
import { Container } from "./style";
import { useData } from "../../../contexts/DataContext";
import { useSelectSearch } from "../../../hooks/useSelectSearch";
import { getCustomSelectStyles } from "../../../styles/customSelectStyles";

export const CustomSelect = ({
  endpoint,
  placeholder,
  type,
  onSelectChange,
  variant = "default", // nova prop para variantes de estilo
  customStyles = {}, // permite sobrescrever estilos específicos
  icon,
}) => {
  const [selected, setSelected] = useState(null);
  const { clients, documents } = useData();
  const { initialOptions, fetchOptions } = useSelectSearch(
    type,
    clients,
    documents
  );

  const handleChange = (selectedOption) => {
    setSelected(selectedOption);

    if (onSelectChange) {
      onSelectChange(selectedOption);
    }
  };

  // Obter os estilos base + customizações
  const selectStyles = getCustomSelectStyles(variant, customStyles);

  return (
    <Container variant={variant}>
      <div
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#aaa",
          fontSize: "1.2rem",
          pointerEvents: "none",
          zIndex: "999",
        }}
      >
        {icon}
      </div>
      <AsyncSelect
        cacheOptions
        loadOptions={(inputValue) => fetchOptions(inputValue, endpoint)}
        defaultOptions={initialOptions}
        placeholder={`Pesquisar ${placeholder}...`}
        isClearable
        value={selected}
        onChange={handleChange}
        styles={selectStyles}
        loadingMessage={() => "Carregando..."}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? "Nenhum resultado encontrado" : "Digite para pesquisar"
        }
      />
    </Container>
  );
};
