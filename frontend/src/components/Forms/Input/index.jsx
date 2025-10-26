import { useState } from "react";
import { InputWrapper, InputLabel, InputField, ToggleButton } from "./style";

import { Eye, EyeSlash } from "react-bootstrap-icons";

export const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <InputWrapper>
      <InputLabel>{label}</InputLabel>
      <InputField
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {type === "password" && (

        <ToggleButton
          isFocused={isFocused}
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <Eye /> : <EyeSlash />}
        </ToggleButton>

      )}
    </InputWrapper>
  );
};
