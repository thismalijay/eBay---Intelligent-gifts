"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GiftAssistantFormData, GiftAssistantSchema } from "./GiftAssistantSchema";

interface GiftItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  tags: string[];
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
const mapFormDataToApiPayload = (data: GiftAssistantFormData, variant: number) => {
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

  const selectedBudget = budgetMap[data.budget] || { min: 0, max: 999999 };
  const selectedOccasion = data.occasion && data.occasion.length > 0 ? occasionMap[data.occasion[0]] || "other" : null; // Assuming single occasion for API for simplicity

  return {
    recipient: {
      relationship: relationshipMap[data.relationship] || "other",
      age_range: ageRangeMap[data.ageRange] || "unknown",
      gender: data.gender ? genderMap[data.gender] || "not_specified" : null, // Ajout du champ gender
    },
    occasion: selectedOccasion,
    personality: data.personality?.map(p => personalityMap[p] || p.toLowerCase().replace(/\s/g, '_')),
    interests: data.interests?.map(i => interestsMap[i] || i.toLowerCase().replace(/\s/g, '_')),
    free_description: data.interestFreeText || null,
    budget: selectedBudget,
    gift_style: giftStyleMap[data.giftStyle] || "safe_classic",
    risk_tolerance: data.riskTolerance ? "medium" : "low", // Simple mapping
    variant: variant, // For "Show more ideas"
  };
};

export const GiftAssistantProvider = ({ children }: { children: ReactNode }) => {
  const totalSteps = 4; // "Who is it for?", "What are they like?", "Budget & type of gift", "Review & confirm"
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [giftExplanation, setGiftExplanation] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<GiftItem[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiCallVariant, setApiCallVariant] = useState(1); // For "Show more ideas"

  const formData = useForm<GiftAssistantFormData>({
    resolver: zodResolver(GiftAssistantSchema),
    defaultValues: {
      relationship: "",
      relationshipText: "",
      ageRange: "",
      gender: "", // Initialisation du nouveau champ gender
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
    if (currentStep < totalSteps + 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps + 1) {
      setCurrentStep(step);
    }
  };

  const fetchRecommendations = useCallback(async (currentFormData: GiftAssistantFormData, isRefetch: boolean = false) => {
    if (isRefetch) {
      setIsLoadingMore(true);
      setApiCallVariant(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      setApiCallVariant(1); // Reset variant for initial submission
    }
    setError(false);
    setErrorMessage(null);

    try {
      const payload = mapFormDataToApiPayload(currentFormData, isRefetch ? apiCallVariant + 1 : 1);
      const response = await fetch(`/api/gift-helper${isRefetch ? `?variant=${apiCallVariant + 1}` : ''}`, {
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
            errorDetail = errorData.message || errorDetail;
          } catch (jsonParseError) {
            // Fallback if JSON parsing fails even with application/json header
            errorDetail = await response.text() || errorDetail;
          }
        } else {
          errorDetail = await response.text() || errorDetail;
        }
        throw new Error(errorDetail);
      }

      // If response is OK, and it's supposed to be JSON
      if (isJson) {
        const data = await response.json();
        setGiftExplanation(data.gift_explanation);
        setRecommendations(data.items);
        if (!isRefetch) {
          setCurrentStep(totalSteps + 1);
        }
      } else {
        // If response is OK but not JSON, it's an unexpected scenario for this API
        throw new Error("Received an unexpected non-JSON response from the server.");
      }

    } catch (err: any) {
      console.error("API Error:", err);
      setError(true);
      setErrorMessage(err.message || "We couldn't fetch gift ideas right now. Please try again in a moment.");
      if (!isRefetch) {
        // If initial fetch failed, go to an error state, not recommendations
        setCurrentStep(totalSteps + 2); // Assuming totalSteps + 2 is an error step or handled by modal
      }
    } finally {
      setIsSubmitting(false);
      setIsLoadingMore(false);
    }
  }, [apiCallVariant, totalSteps]);

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
    setApiCallVariant(1);
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