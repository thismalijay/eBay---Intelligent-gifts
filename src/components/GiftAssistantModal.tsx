"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GiftAssistantProvider, useGiftAssistant } from "./gift-assistant/GiftAssistantContext";
import StepOccasion from "./gift-assistant/StepOccasion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Placeholder for other steps
const StepAboutPerson = () => <div className="p-4 text-center">Step 2: About the person (Coming Soon!)</div>;
const StepInterests = () => <div className="p-4 text-center">Step 3: Interests (Coming Soon!)</div>;
const StepBudgetStyle = () => <div className="p-4 text-center">Step 4: Budget & Style (Coming Soon!)</div>;
const StepReview = () => <div className="p-4 text-center">Step 5: Review (Coming Soon!)</div>;
const StepResults = () => <div className="p-4 text-center">Step 6: AI Results (Coming Soon!)</div>;


const steps = [
  { id: 1, name: "Occasion", component: StepOccasion },
  { id: 2, name: "About them", component: StepAboutPerson },
  { id: 3, name: "Interests", component: StepInterests },
  { id: 4, name: "Budget & style", component: StepBudgetStyle },
  { id: 5, name: "Review", component: StepReview },
  { id: 6, name: "Results", component: StepResults }, // This is the final results step
];

const GiftAssistantModalContent = ({ onClose }: { onClose: () => void }) => {
  const { currentStep, goToNextStep, goToPreviousStep, formData, isSubmitting, submitForm } = useGiftAssistant();
  const { trigger, getValues } = formData;

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger("occasion");
      if (getValues("occasion") === "Other") {
        isValid = isValid && await trigger("occasionText");
      }
    }
    // Add validation for other steps here as they are implemented
    // else if (currentStep === 2) { isValid = await trigger(["relationship", "ageRange"]); }
    // ...

    if (isValid) {
      if (currentStep === steps.length - 1) { // If it's the review step
        await submitForm();
      } else {
        goToNextStep();
      }
    } else {
      // Scroll to first error if validation fails
      const firstError = Object.keys(formData.formState.errors).find(key => formData.formState.errors[key]);
      if (firstError) {
        const element = document.getElementById(firstError);
        element?.focus();
      }
    }
  };

  const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component || null;
  const isLastStep = currentStep === steps.length - 1; // Review step
  const isResultsStep = currentStep === steps.length;

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-center text-2xl font-bold">
          {isResultsStep ? "Gift Ideas" : `Step ${currentStep} of ${steps.length - 1}: ${steps[currentStep - 1]?.name}`}
        </DialogTitle>
        {!isResultsStep && (
          <DialogDescription className="sr-only">
            {`You are on step ${currentStep} of ${steps.length - 1}, which is about ${steps[currentStep - 1]?.name}.`}
          </DialogDescription>
        )}
      </DialogHeader>

      {/* Horizontal Stepper */}
      {!isResultsStep && (
        <div className="flex justify-between items-center mb-6 px-4">
          {steps.slice(0, steps.length - 1).map((step) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    currentStep > step.id
                      ? "bg-blue-600 text-white"
                      : currentStep === step.id
                      ? "bg-blue-400 text-white"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  )}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </div>
                <span className="text-xs mt-1 text-center hidden sm:block">
                  {step.name}
                </span>
              </div>
              {step.id < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-grow h-0.5 mx-2",
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="flex-grow overflow-y-auto">
        {CurrentStepComponent && <CurrentStepComponent />}
      </div>

      {/* Bottom Area (Persistent) */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 1 || isSubmitting || isResultsStep}
          className="min-w-[80px]"
        >
          Back
        </Button>
        {isResultsStep ? (
          <Button onClick={onClose} className="min-w-[120px]">
            Close
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding gifts...
              </>
            ) : isLastStep ? (
              "Ask AI for ideas"
            ) : (
              "Next"
            )}
          </Button>
        )}
      </div>
    </DialogContent>
  );
};

export const GiftAssistantModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <GiftAssistantProvider>
        <GiftAssistantModalContent onClose={onClose} />
      </GiftAssistantProvider>
    </Dialog>
  );
};