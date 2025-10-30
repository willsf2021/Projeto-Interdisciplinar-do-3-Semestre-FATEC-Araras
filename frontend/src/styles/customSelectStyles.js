// styles/customSelectStyles.js
export const getCustomSelectStyles = (
  variant = "default",
  customStyles = {}
) => {
  // Estilo base (seu estilo original)
  const baseStyles = {
    control: (provided, state) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      borderRadius: 24,
      border: "1px solid #ccc",
      minHeight: 48,
      height: 48,
      paddingLeft: 40,
      boxShadow: "none",
      backgroundColor: "#fff",
      "&:hover": { borderColor: "#aaa" },
      borderColor: state.isFocused ? "#007bff" : "#ccc",
      ...customStyles.control,
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      fontSize: "1rem",
      ...customStyles.input,
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "1rem",
      color: "#aaa",
      ...customStyles.placeholder,
    }),
    indicatorsContainer: (provided) =>
      variant == "default"
        ? {
            ...provided,
            display: "none",
            ...customStyles.indicatorsContainer,
          }
        : { ...provided },
    menu: (provided) => ({
      ...provided,
      borderRadius: 12,
      marginTop: 4,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      ...customStyles.menu,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f8f9fa" : "#fff",
      color: "#333",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#e9ecef",
      },
      ...customStyles.option,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#333",
      ...customStyles.singleValue,
    }),
  };

  // Variantes pré-definidas
  const variants = {
    default: baseStyles,

    compact: {
      ...baseStyles,
      control: (provided, state) => ({
        ...baseStyles.control(provided, state),
        minHeight: 40,
        height: 40,
        paddingLeft: 36,
        borderRadius: 20,
      }),
    },

    modern: {
      ...baseStyles,
      control: (provided, state) => ({
        ...baseStyles.control(provided, state),
        borderRadius: 12,
        border: "2px solid #e5e7eb",
        minHeight: 48,
        paddingLeft: 44,
        "&:hover": { borderColor: "#3ea896" },
        borderColor: state.isFocused ? "#3ea896" : "#e5e7eb",
        backgroundColor: state.isFocused ? "#f8f9fa" : "#fff",
      }),
      menu: (provided) => ({
        ...baseStyles.menu(provided),
        borderRadius: "0 0 8px 8px",
        border: "2px solid #3ea896",
        borderTop: "none",
        marginTop: 0,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }),
      option: (provided, state) => ({
        ...baseStyles.option(provided, state),
        padding: "12px 16px",
        backgroundColor: state.isFocused ? "#f3f4f6" : "#fff",
        color: state.isSelected ? "#3ea896" : "#333",
        fontWeight: state.isSelected ? "500" : "normal",
        "&:active": {
          backgroundColor: "#e8f5f2",
        },
      }),
    },

    minimal: {
      ...baseStyles,
      control: (provided, state) => ({
        ...baseStyles.control(provided, state),
        border: "none",
        backgroundColor: "transparent",
        borderBottom: "2px solid #e5e7eb",
        borderRadius: 0,
        minHeight: 40,
        paddingLeft: 32,
        "&:hover": {
          borderBottomColor: "#3ea896",
          backgroundColor: "transparent",
        },
        borderBottomColor: state.isFocused ? "#3ea896" : "#e5e7eb",
      }),
      menu: (provided) => ({
        ...baseStyles.menu(provided),
        borderRadius: 8,
        marginTop: 8,
      }),
    },
  };

  return variants[variant] || variants.default;
};

// Exportar as variantes individuais também
export const customSelectStyles = getCustomSelectStyles("default");
export const compactSelectStyles = getCustomSelectStyles("compact");
export const modernSelectStyles = getCustomSelectStyles("modern");
export const minimalSelectStyles = getCustomSelectStyles("minimal");
