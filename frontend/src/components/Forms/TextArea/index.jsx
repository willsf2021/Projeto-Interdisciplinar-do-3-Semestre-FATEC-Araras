import { useState } from "react";
import { TextAreaWrapper, TextAreaLabel, TextField } from "./style";

import { Eye, EyeSlash } from "react-bootstrap-icons";

export const TextArea = ({
  label,
  name = "",
  value,
  onChange,
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextAreaWrapper>
      <TextAreaLabel>{label}</TextAreaLabel>
      <TextField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        name={name}
      />
    </TextAreaWrapper>
  );
};
