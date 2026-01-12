"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const personalityOptions = [
  "Calm", "Adventurous", "Creative", "Funny", "Serious", "Geeky", "Sporty", "Homebody", "Organized"
];

const interestOptions = [
  "Tech & gadgets", "Books & reading", "Gaming", "Fashion & style", "Beauty / self-care",
  "Food & cooking", "Coffee & tea", "Music & audio", "Art & design", "DIY & crafting",
  "Outdoors & travel", "Pets & animals", "Home & decor"
];

const StepInterests = () => {
  const { formData } = useGiftAssistant();
  const { register, watch, setValue } = formData;
  const selectedPersonalities = watch("personality") || [];
  const selectedInterests = watch("interests") || [];

  const handleToggle = (field: "personality" | "interests", value: string) => {
    const currentValues = new Set(watch(field) || []);
    if (currentValues.has(value)) {
      currentValues.delete(value);
    } else {
      currentValues.add(value);
    }
    setValue(field, Array.from(currentValues), { shouldValidate: true });
  };

  const hasSelectedAnything = selectedPersonalities.length > 0 || selectedInterests.length > 0 || watch("interestFreeText");

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-2">What are they like?</h2>
      <p className="text-gray-600 dark:text-gray-400">You don’t have to be exact, just a rough idea helps a lot.</p>

      {/* Personality Chips */}
      <div>
        <Label className="mb-2 block">Personality (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {personalityOptions.map((personality) => (
            <button
              key={personality}
              type="button"
              onClick={() => handleToggle("personality", personality)}
              className={cn(
                "flex items-center justify-center px-4 py-2 rounded-full border transition-colors",
                selectedPersonalities.includes(personality)
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              )}
            >
              {selectedPersonalities.includes(personality) && <CheckIcon className="mr-2 h-4 w-4" />}
              {personality}
            </button>
          ))}
        </div>
      </div>

      {/* Interest Chips */}
      <div>
        <Label className="mb-2 block">Interests (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => handleToggle("interests", interest)}
              className={cn(
                "flex items-center justify-center px-4 py-2 rounded-full border transition-colors",
                selectedInterests.includes(interest)
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              )}
            >
              {selectedInterests.includes(interest) && <CheckIcon className="mr-2 h-4 w-4" />}
              {interest}
            </button>
          ))}
        </div>
        {!hasSelectedAnything && (
          <p className="text-sm text-gray-500 mt-4">
            We’ll show more general, safe gifts since we don’t know much yet.
          </p>
        )}
      </div>

      {/* Optional Free Text */}
      <div>
        <Label htmlFor="interestFreeText" className="mb-2 block">Describe them in one sentence (optional)</Label>
        <Input
          id="interestFreeText"
          placeholder="Example: Loves cooking, hates clutter, always traveling on weekends."
          {...register("interestFreeText")}
        />
      </div>
    </div>
  );
};

export default StepInterests;