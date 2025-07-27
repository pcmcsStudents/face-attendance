"use client"

import { cn } from "@/lib/utils"

interface StepCircleProps {
  step: number
  currentStep: number
  totalSteps: number
}

function StepCircle({ step, currentStep, totalSteps }: StepCircleProps) {
  const isCompleted = step < currentStep
  const isActive = step === currentStep
  const isInactive = step > currentStep

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full transition-all duration-300 ease-in-out",
          {
            // Inactive state - light grey filled circle
            "w-8 h-8 bg-gray-300": isInactive,
            // Active state - larger, pulsing circle with colored border
            "w-10 h-10 bg-white border-2 border-blue-500 animate-pulse shadow-lg": isActive,
            // Completed state - solid colored circle with checkmark
            "w-8 h-8 bg-green-500": isCompleted,
          },
        )}
      >
        {isCompleted && (
          <svg
            className="w-4 h-4 text-white transition-opacity duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isActive && <div className="w-3 h-3 bg-blue-500 rounded-full transition-all duration-300"></div>}
      </div>

      {/* Step number label */}
      <span
        className={cn("text-xs font-medium transition-colors duration-300", {
          "text-gray-400": isInactive,
          "text-blue-600": isActive,
          "text-green-600": isCompleted,
        })}
      >
        {step}
      </span>
    </div>
  )
}

interface ProgressIndicatorProps {
  totalSteps: number
  currentStep: number
}

export function ProgressIndicator({ totalSteps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex justify-center items-center space-x-6 py-4">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        return (
          <div key={stepNumber} className="flex items-center">
            <StepCircle step={stepNumber} currentStep={currentStep} totalSteps={totalSteps} />

            {/* Connection line between steps */}
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  "w-12 h-0.5 mx-3 transition-colors duration-300",
                  stepNumber < currentStep ? "bg-green-500" : "bg-gray-300",
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
