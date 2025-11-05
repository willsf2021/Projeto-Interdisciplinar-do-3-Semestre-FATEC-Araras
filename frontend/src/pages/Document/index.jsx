import React, { useState } from "react";
import { Container } from "./style.js";
import { Step1 } from "./Partials/Step1";
import { Step2 } from "./Partials/Step2";
import { Step3 } from "./Partials/Step3";
import { Step4 } from "./Partials/Step4";

import { HouseFill } from "react-bootstrap-icons";

export const Document = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, name: "Cliente" },
    { number: 2, name: "Receita" },
    { number: 3, name: "Ingredientes" },
    { number: 4, name: "Alergênicos" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  const handleHome = () => {
    window.location.href = "/home";
  };

  return (
    <Container>
      <header className="container-steps">
        <ul>
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <li className="steps-item-container">
                <div className="span-container">
                  <span
                    className={`steps-items-span ${
                      currentStep === step.number ? "active" : ""
                    }`}
                    onClick={() => handleStepClick(step.number)}
                  >
                    {step.number}
                  </span>
                </div>
                <p
                  className={`steps-item-name ${
                    currentStep === step.number ? "p-active" : ""
                  }`}
                ></p>
              </li>

              {index < steps.length - 1 && <span className="hr-steps"></span>}
            </React.Fragment>
          ))}
        </ul>
      </header>

      <div className="step-content">
        <div className="step-content-inner">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
        </div>

        <div className="control-buttons">
          <div className="container-control-home">
            <button onClick={handleHome}>
              <HouseFill />
            </button>
          </div>
          <div className="container-control-button">
            <button
              className="prev-step"
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              Voltar
            </button>
          </div>
          <div className="container-control-button">
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length}
            >
              {currentStep === steps.length ? "Finalizar" : "Avançar"}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};
