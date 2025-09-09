import { Check } from "lucide-react";


export const BookingStepper = ({ currentStep, totalSteps, steps, isFinished = false, onStepClick }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep || (isFinished && stepNumber === currentStep);
          const isCurrent = stepNumber === currentStep && !isFinished;
          const isClickable = typeof onStepClick === 'function' && stepNumber < currentStep && !isFinished;
          
          return (
            <div key={step} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                {isClickable ? (
                  <button
                    type="button"
                    onClick={() => onStepClick?.(stepNumber)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                      ${isCompleted
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'bg-muted text-muted-foreground border border-border'
                      }
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                    `}
                    aria-label={`Go to step ${stepNumber}: ${step}`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </button>
                ) : (
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                      ${isCompleted
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground border border-border'
                      }
                    `}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                )}
                
                {/* Step Label */}
                <span
                  className={`
                    mt-2 text-xs font-medium text-center max-w-20
                    ${isCurrent ? 'text-primary' : 'text-muted-foreground'}
                  `}
                >
                  {step}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-all duration-300
                    ${isCompleted ? 'bg-primary' : 'bg-border'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};