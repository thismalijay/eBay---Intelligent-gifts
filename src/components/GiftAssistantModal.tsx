"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GiftAssistantProvider, useGiftAssistant } from "./gift-assistant/GiftAssistantContext";
import StepAboutPerson from "./gift-assistant/StepAboutPerson";
import StepInterests from "./gift-assistant/StepInterests";
import StepBudgetStyle from "./gift-assistant/StepBudgetStyle";
import StepReview from "./gift-assistant/StepReview";
import StepRecommendations from "./gift-assistant/StepRecommendations";
import { cn } from "@/lib/utils";
import { Loader2, AlertCircle } from "lucide-react"; // Added AlertCircle import

const steps = [
  { id: 1, name: "Who is the gift for?", component: StepAboutPerson },
  { id: 2, name: "What are they like?", component: StepInterests },
  { id: 3, name: "Budget & type of gift", component: StepBudgetStyle },
  { id: 4, name: "Review & confirm", component: StepReview },
  { id: 5, name: "Recommendations", component: StepRecommendations }, // This is the final results step
];

const GiftAssistantModalContent = ({ onClose }: { onClose: () => void }) => {
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    formData,
    isSubmitting,
    submitForm,
    resetFormAndGoToFirstStep,
    error,
    errorMessage,
    recommendations,
  } = useGiftAssistant();
  const { trigger, getValues } = formData;

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["relationship", "ageRange"]);
      if (getValues("relationship") === "Other") {
        isValid = isValid && await trigger("relationshipText");
      }
    } else if (currentStep === 2) {
      isValid = true; // Personality, interests, and free text are optional
    } else if (currentStep === 3) {
      isValid = await trigger(["budget", "giftStyle"]);
    } else if (currentStep === 4) { // Review step
      isValid = true;
      await submitForm();
      return; // Submit handles navigation to results
    }

    if (isValid) {
      goToNextStep();
    } else {
      const firstError = Object.keys(formData.formState.errors).find(key => formData.formState.errors[key]);
      if (firstError) {
        const element = document.getElementById(firstError);
        element?.focus();
      }
    }
  };

  const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component || null;
  const isReviewStep = currentStep === 4;
  const isRecommendationsStep = currentStep === 5;
  const totalFormSteps = steps.length - 1; // Exclude the final recommendations step from the count

  // Determine if we should show the error state
  const showApiErrorState = error && currentStep !== 5; // Show error if API failed and we're not on recommendations page

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-center text-2xl font-bold">
          {isRecommendationsStep ? "Gift Ideas" : `Step ${currentStep} of ${totalFormSteps}: ${steps[currentStep - 1]?.name}`}
        </DialogTitle>
        {!isRecommendationsStep && (
          <DialogDescription className="sr-only">
            {`You are on step ${currentStep} of ${totalFormSteps}, which is about ${steps[currentStep - 1]?.name}.`}
          </DialogDescription>
        )}
      </DialogHeader>

      {/* Horizontal Stepper */}
      {!isRecommendationsStep && !showApiErrorState && (
        <div className="flex justify-between items-center mb-6 px-4">
          {steps.slice(0, totalFormSteps).map((step) => (
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
              {step.id < totalFormSteps && (
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
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-medium">Looking through millions of gifts for the best matches...</p>
          </div>
        ) : showApiErrorState ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 text-destructive">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium mb-2">Oops! Something went wrong.</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{errorMessage}</p>
          </div>
        ) : (
          CurrentStepComponent && <CurrentStepComponent />
        )}
      </div>

      {/* Bottom Area (Persistent) */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {showApiErrorState ? (
          <>
            <Button variant="outline" onClick={() => goToStep(4)} className="min-w-[120px]">
              Back to questions
            </Button>
            <Button onClick={submitForm} disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Trying again...
                </>
              ) : (
                "Try again"
              )}
            </Button>
          </>
        ) : isRecommendationsStep ? (
          <>
            <Button variant="outline" onClick={() => goToStep(4)} className="min-w-[120px]">
              Change my answers
            </Button>
            <Button onClick={onClose} className="min-w-[120px]">
              Close
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1 || isSubmitting}
              className="min-w-[80px]"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isReviewStep ? "Finding gifts..." : "Loading..."}
                </>
              ) : isReviewStep ? (
                "See gift ideas"
              ) : (
                "Next"
              )}
            </Button>
          </>
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