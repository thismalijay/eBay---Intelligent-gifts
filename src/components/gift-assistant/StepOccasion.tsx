"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const occasions = [
  { value: "Secret Santa at work", label: "Secret Santa at work" },
  { value: "Office birthday", label: "Office birthday" },
  { value: "Holiday gift exchange", label: "Holiday gift exchange" },
  { value: "Thank you gift", label: "Thank you gift" },
  { value: "Farewell / Leaving present", label: "Farewell / Leaving present" },
  { value: "Other", label: "Other" },
];

const StepOccasion = () => {
  const { formData } = useGiftAssistant();
  const { register, watch, setValue, formState: { errors } } = formData;
  const selectedOccasion = watch("occasion");
  const occasionText = watch("occasionText");

  const handleOccasionChange = (value: string) => {
    setValue("occasion", value, { shouldValidate: true });
    if (value !== "Other") {
      setValue("occasionText", "");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">What’s the occasion?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">We’ll tailor the gift to the context.</p>

      <RadioGroup
        onValueChange={handleOccasionChange}
        value={selectedOccasion}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {occasions.map((occasion) => (
          <Label
            key={occasion.value}
            htmlFor={occasion.value}
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
              selectedOccasion === occasion.value && "border-primary ring-2 ring-primary"
            )}
          >
            <RadioGroupItem
              value={occasion.value}
              id={occasion.value}
              className="sr-only"
              {...register("occasion")}
            />
            <span className="block w-full text-center font-semibold">{occasion.label}</span>
          </Label>
        ))}
      </RadioGroup>

      {selectedOccasion === "Other" && (
        <div className="mt-6">
          <Label htmlFor="occasionText" className="mb-2 block">Describe the occasion</Label>
          <Input
            id="occasionText"
            placeholder="Example: Team celebration, promotion, new baby…"
            {...register("occasionText", {
              required: selectedOccasion === "Other" ? "Please describe the occasion." : false,
              minLength: {
                value: 3,
                message: "Please provide at least 3 characters for the occasion description.",
              },
            })}
            className={cn(errors.occasionText && "border-destructive")}
          />
          {errors.occasionText && (
            <p className="text-sm text-destructive mt-1">{errors.occasionText.message}</p>
          )}
        </div>
      )}

      {errors.occasion && !selectedOccasion && (
        <p className="text-sm text-destructive mt-4">{errors.occasion.message}</p>
      )}
    </div>
  );
};

export default StepOccasion;