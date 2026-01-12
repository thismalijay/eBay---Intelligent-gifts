"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GiftAssistantFormData, GiftAssistantSchema } from "./GiftAssistantSchema";

// Updated GiftItem interface to match OpenAI's output
interface GiftItem {
  title: string;
  description: string;
  approx_price: number;
  reason: string;
}

interface GiftAssistantContextType {
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  formData: UseFormReturn<GiftAssistantFormData>;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  submitForm: () => Promise<void>;
  resetFormAndGoToFirstStep: () => void;
  giftExplanation: string | null;
  recommendations: GiftItem[];
  error: boolean;
  errorMessage: string | null;
  isLoadingMore: boolean;
  refetchRecommendations: () => Promise<void>;
}

const GiftAssistantContext = createContext<GiftAssistantContextType | undefined>(undefined);

// Helper to map UI values to API canonical values
const mapFormDataToApiPayload = (data: GiftAssistantFormData) => {
  const budgetMap: { [key: string]: { min: number; max: number } } = {
    "Under 10": { min: 0, max: 9.99 },
    "10-25": { min: 10, max: 25 },
    "25-50": { min: 25, max: 50 },
    "50-100": { min: 50, max: 100 },
    "100+": { min: 100, max: 999999 }, // Effectively no upper limit
  };

  const relationshipMap: { [key: string]: string } = {
    "Partner": "partner",
    "Close friend": "close_friend",
    "Family member": "family",
    "Child / Teen": "child_teen",
    "Colleague / Boss": "colleague",
    "Someone I don’t know well": "someone_i_dont_know_well",
    "Other": "other",
  };

  const occasionMap: { [key: string]: string } = {
    "Birthday": "birthday",
    "Christmas / Holidays": "christmas",
    "Anniversary": "anniversary",
    "Thank you": "thank_you",
    "Just because": "just_because",
    "Other": "other",
  };

  const ageRangeMap: { [key: string]: string } = {
    "0–5": "0-5",
    "6–12": "6-12",
    "13–17": "13-17",
    "18–24": "18-24",
    "25–34": "25-34",
    "35–44": "35-44",
    "45–54": "45-54",
    "55+": "55+",
    "I’m not sure": "unknown",
  };

  const giftStyleMap: { [key: string]: string } = {
    "Safe & classic": "safe_classic",
    "Useful": "useful",
    "Fun & playful": "fun_playful",
    "Special & thoughtful": "special_thoughtful",
  };

  const personalityMap: { [key: string]: string } = {
    "Calm": "calm",
    "Adventurous": "adventurous",
    "Creative": "creative",
    "Funny": "funny",
    "Serious": "serious",
    "Geeky": "geeky",
    "Sporty": "sporty",
    "Homebody": "homebody",
    "Organized": "organized",
  };

  const interestsMap: { [key: string]: string } = {
    "Tech & gadgets": "tech_gadgets",
    "Books & reading": "books_reading",
    "Gaming": "gaming",
    "Fashion & style": "fashion_style",
    "Beauty / self-care": "beauty_self_care",
    "Food & cooking": "food_cooking",
    "Coffee & tea": "coffee_tea",
    "Music & audio": "music_audio",
    "Art & design": "art_design",
    "DIY & crafting": "diy_crafting",
    "Outdoors & travel": "outdoors_travel",
    "Pets & animals": "pets_animals",
    "Home & decor": "home_decor",
  };

  const genderMap: { [key: string]: string } = {
    "Male": "male",
    "Female": "female",
    "Non-binary": "non_binary",
    "Prefer not to say": "not_specified",
  };

  const selectedBudgetRange = budgetMap[data.budget] || { min: 0, max: 999999 };
  const selectedOccasion = data.occasion && data.occasion.length > 0 ? occasionMap[data.occasion[0]] || "other" : null;

  return {
    recipient: {
      relationship: relationshipMap[data.relationship] || "other",
      age_range: ageRangeMap[data.ageRange] || "unknown",
      gender: data.gender ? genderMap[data.gender] || "not_specified" : null,
    },
    occasion: selectedOccasion,
    personality: data.personality?.map(p => personalityMap[p] || p.toLowerCase().replace(/\s/g, '_')),
    interests: data.interests?.map(i => interestsMap[i] || i.toLowerCase().replace(/\s/g, '_')),
    free_description: data.interestFreeText || null,
    budget: selectedBudgetRange,
    gift_style: giftStyleMap[data.giftStyle] || "safe_classic",
    risk_tolerance: data.riskTolerance ? "medium" : "low",
  };
};

export const GiftAssistantProvider = ({ children }: { children: ReactNode }) => {
  const totalFormSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [giftExplanation, setGiftExplanation] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<GiftItem[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formData = useForm<GiftAssistantFormData>({
    resolver: zodResolver(GiftAssistantSchema),
    defaultValues: {
      relationship: "",
      relationshipText: "",
      ageRange: "",
      gender: "",
      occasion: [],
      personality: [],
      interests: [],
      interestFreeText: "",
      budget: "",
      giftStyle: "",
      riskTolerance: false,
    },
  });

  const goToNextStep = () => {
    if (currentStep < totalFormSteps + 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalFormSteps + 1) {
      setCurrentStep(step);
    }
  };

  const fetchRecommendations = useCallback(async (currentFormData: GiftAssistantFormData, isRefetch: boolean = false) => {
    if (isRefetch) {
      setIsLoadingMore(true);
    } else {
      setIsSubmitting(true);
    }
    setError(false);
    setErrorMessage(null);

    try {
      const payload = mapFormDataToApiPayload(currentFormData);
      // Call the Supabase Edge Function
      const response = await fetch("/functions/v1/gift-helper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!response.ok) {
        let errorDetail = "Failed to fetch gift recommendations.";
        if (isJson) {
          try {
            const errorData = await response.json();
            errorDetail = errorData.details || errorData.error || errorDetail;
          } catch (jsonParseError) {
            errorDetail = await response.text() || errorDetail;
          }
        } else {
          errorDetail = await response.text() || errorDetail;
        }
        throw new Error(errorDetail);
      }

      if (isJson) {
        const data = await response.json();
        setGiftExplanation("Here are some gift ideas based on your preferences."); // Default explanation
        setRecommendations(data.items);
        if (!isRefetch) {
          setCurrentStep(totalFormSteps + 1); // Move to recommendations step
        }
      } else {
        throw new Error("Received an unexpected non-JSON response from the server.");
      }

    } catch (err: any) {
      console.error("API Error:", err);
      setError(true);
      setErrorMessage(err.message || "We couldn't fetch gift ideas right now. Please try again in a moment.");
      // On error, stay on the current step (review step if it was an initial submit)
      // The modal's `showApiErrorState` will handle displaying the error message.
    } finally {
      setIsSubmitting(false);
      setIsLoadingMore(false);
    }
  }, [totalFormSteps]);

  const submitForm = async () => {
    await fetchRecommendations(formData.getValues(), false);
  };

  const refetchRecommendations = async () => {
    await fetchRecommendations(formData.getValues(), true);
  };

  const resetFormAndGoToFirstStep = () => {
    formData.reset();
    setCurrentStep(1);
    setGiftExplanation(null);
    setRecommendations([]);
    setError(false);
    setErrorMessage(null);
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
        resetFormAndGoToFirstStep,
        giftExplanation,
        recommendations,
        error,
        errorMessage,
        isLoadingMore,
        refetchRecommendations,
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