import React from "react";
import { ToggleContainer, Toggle, ToggleOption, Slider } from "./style";

export const ToggleSwitch = ({ options, activeOption, onChange }) => {
  const activeIndex = options.findIndex((opt) => opt.value === activeOption);

  return (
    <ToggleContainer>
      <Toggle>
        <Slider activeIndex={activeIndex} />
        {options.map((option) => (
          <ToggleOption
            key={option.value}
            $active={activeOption === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </ToggleOption>
        ))}
      </Toggle>
    </ToggleContainer>
  );
};
