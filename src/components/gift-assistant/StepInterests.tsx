"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const interestOptions = [
  "Coffee & tea", "Office gadgets", "Plants & gardening", "Books & reading",
  "Gaming & geeky stuff", "Tech & gadgets", "Fitness & sports", "Art & design",
  "Music", "Food & snacks", "Travel", "DIY & crafting", "Pets & animals"
];

const StepInterests = () => {
  const { formData } = useGiftAssistant();
  const { register, watch, setValue } = formData;
  const selectedInterests = watch("interests") || [];

  const handleInterestToggle = (interest: string) => {
    const currentInterests = new Set(selectedInterests);
    if (currentInterests.has(interest)) {
      currentInterests.delete(interest);
    } else {
      currentInterests.add(interest);
    }
    setValue("interests", Array.from(currentInterests), { shouldValidate: true });
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-2">What do they like?</h2>
      <p className="text-gray-600 dark:text-gray-400">We’ll base gift ideas on what makes them smile.</p>

      {/* Interest Chips */}
      <div>
        <Label className="mb-2 block">Select interests (pick one or more)</Label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => handleInterestToggle(interest)}
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
        {selectedInterests.length === 0 && (
          <p className="text-sm text-gray-500 mt-4">
            Don’t worry, we’ll show more general, ‘safe’ gifts if you don't pick any.
          </p>
        )}
      </div>

      {/* Optional Free Text */}
      <div>
        <Label htmlFor="interestFreeText" className="mb-2 block">Describe them in one sentence (optional)</Label>
        <Input
          id="interestFreeText"
          placeholder="Example: 'UX designer, loves plants, always joking in meetings, hates early mornings.'"
          {...register("interestFreeText")}
        />
      </div>
    </div>
  );
};

export default StepInterests;