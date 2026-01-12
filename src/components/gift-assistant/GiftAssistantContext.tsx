"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GiftAssistantFormData, GiftAssistantSchema } from "./GiftAssistantSchema";

interface GiftAssistantContextType {
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  formData: UseFormReturn<GiftAssistantFormData>;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  submitForm: () => Promise<void>;
}

const GiftAssistantContext = createContext<GiftAssistantContextType | undefined>(undefined);

export const GiftAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5; // Occasion, About them, Interests, Budget & style, Review

  const formData = useForm<GiftAssistantFormData>({
    resolver: zodResolver(GiftAssistantSchema),
    defaultValues: {
      occasion: "Secret Santa at work", // Preselected as per prompt
      occasionText: "",
      relationship: "",
      gender: "I'm not sure / Doesn't matter", // Default to neutral
      ageRange: "",
      personality: [],
      interests: [],
      interestFreeText: "",
      budgetMin: 10, // Default budget range
      budgetMax: 20,
      giftTone: "",
      allowPersonalization: false,
    },
  });

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", formData.getValues());
    setIsSubmitting(false);
    setCurrentStep(totalSteps + 1); // Move to results step
  };

  return (
    <GiftAssistantContext.Provider
      value={{
        currentStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        formData,
        isSubmitting,
        setIsSubmitting,
        submitForm,
      }}
    >
      {children}
    </GiftAssistantContext.Provider>
  );
};

export const useGiftAssistant = () => {
  const context = useContext(GiftAssistantContext);
  if (context === undefined) {
    throw new Error("useGiftAssistant must be used within a GiftAssistantProvider");
  }
  return context;
};