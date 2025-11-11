import { useState } from "react";
import { ButtonElement } from "./style";

export const SubmitButton = ({
  title,
  type = "button",
  onClick,
  disabled = false,
  variant = "submit"
}) => {
  return (
    <ButtonElement variant ={variant} type={type} onClick={onClick} disabled={disabled}>
      {title}
    </ButtonElement>
  );
};
