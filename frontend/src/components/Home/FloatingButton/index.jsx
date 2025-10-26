import React from "react";
import { FloatingBtn } from "./style";

export const FloatingButton = ({ icon, href, onClick }) => {
  if (href) {
    return (
      <FloatingBtn as="a" href={href}>
        {icon}
      </FloatingBtn>
    );
  }

  return <FloatingBtn onClick={onClick}>{icon}</FloatingBtn>;
};
