import React from 'react';
import './CheckoutSteps.css';

const CheckoutSteps = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="checkout-steps">
      {steps.map((step, index) => (
        <div
          key={step.number}
          className={`step ${step.active ? 'active' : ''} ${
            step.number < currentStep ? 'completed' : ''
          }`}
          onClick={() => onStepClick(step.number)}
        >
          <div className="step-number">
            {step.number < currentStep ? '✓' : step.number}
          </div>
          <div className="step-title">{step.title}</div>
          {index < steps.length - 1 && <div className="step-connector"></div>}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;