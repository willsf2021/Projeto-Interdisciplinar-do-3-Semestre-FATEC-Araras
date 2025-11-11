// components/Home/CustomSelect/index.jsx
import React, { useState, useEffect } from "react"; // Adicione useEffect
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
  variant = "default",
  customStyles = {},
  icon,
  value, // Certifique-se que esta prop está sendo recebida
}) => {
  const [selected, setSelected] = useState(null);
  const { clients, documents } = useData();
  const { initialOptions, fetchOptions } = useSelectSearch(
    type,
    clients,
    documents
  );

  // Efeito para sincronizar o value externo com o estado interno
  useEffect(() => {
    if (value) {
      setSelected(value);
    } else {
      setSelected(null);
    }
  }, [value]);

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