import { useState } from "react";
import { ButtonElement } from "./style";

export const SubmitButton = ({ title, type = "button", onClick }) => {
  return (
    <ButtonElement type={type} onClick={onClick}>
      {title}
    </ButtonElement>
  );
};
