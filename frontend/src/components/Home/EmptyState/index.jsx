import React from "react";
import { EmptyStateContainer, HighlightText } from "./style";

export const EmptyState = ({ text, linkText, linkHref }) => {
  const renderText = () => {
    if (!linkText) return <p>{text}</p>;

    const parts = text.split(`"${linkText}"`);

    return (
      <p>
        {parts[0]}
        {linkHref ? (
          <a href={linkHref}>
            <HighlightText>"{linkText}"</HighlightText>
          </a>
        ) : (
          <HighlightText>"{linkText}"</HighlightText>
        )}
        {parts[1]}
      </p>
    );
  };

  return <EmptyStateContainer>{renderText()}</EmptyStateContainer>;
};
