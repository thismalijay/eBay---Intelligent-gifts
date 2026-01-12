"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const relationships = [
  { value: "Partner", label: "Partner" },
  { value: "Close friend", label: "Close friend" },
  { value: "Family member", label: "Family member" },
  { value: "Child / Teen", label: "Child / Teen" },
  { value: "Colleague / Boss", label: "Colleague / Boss" },
  { value: "Someone I don’t know well", label: "Someone I don’t know well" },
  { value: "Other", label: "Other" },
];

const ageRanges = [
  { value: "0–5", label: "0–5" },
  { value: "6–12", label: "6–12" },
  { value: "13–17", label: "13–17" },
  { value: "18–24", label: "18–24" },
  { value: "25–34", label: "25–34" },
  { value: "35–44", label: "35–44" },
  { value: "45–54", label: "45–54" },
  { value: "55+", label: "55+" },
  { value: "I’m not sure", label: "I’m not sure" },
];

const occasionOptions = [
  "Birthday", "Christmas / Holidays", "Anniversary", "Thank you", "Just because", "Other"
];

const StepAboutPerson = () => {
  const { formData } = useGiftAssistant();
  const { register, watch, setValue, formState: { errors } } = formData;
  const selectedRelationship = watch("relationship");
  const selectedOccasions = watch("occasion") || [];

  const handleOccasionToggle = (occasion: string) => {
    const currentOccasions = new Set(selectedOccasions);
    if (currentOccasions.has(occasion)) {
      currentOccasions.delete(occasion);
    } else {
      currentOccasions.add(occasion);
    }
    setValue("occasion", Array.from(currentOccasions), { shouldValidate: true });
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-2">Who is this gift for?</h2>
      <p className="text-gray-600 dark:text-gray-400">We’ll adapt ideas depending on your relationship and their age.</p>

      {/* Relationship */}
      <div>
        <Label className="mb-2 block">Relationship</Label>
        <RadioGroup
          onValueChange={(value) => {
            setValue("relationship", value, { shouldValidate: true });
            if (value !== "Other") {
              setValue("relationshipText", "");
            }
          }}
          value={selectedRelationship}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          {relationships.map((rel) => (
            <Label
              key={rel.value}
              htmlFor={rel.value}
              className={cn(
                "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                selectedRelationship === rel.value && "border-primary ring-2 ring-primary"
              )}
            >
              <RadioGroupItem
                value={rel.value}
                id={rel.value}
                className="sr-only"
                {...register("relationship")}
              />
              <span className="text-sm font-medium">{rel.label}</span>
            </Label>
          ))}
        </RadioGroup>
        {errors.relationship && (
          <p className="text-sm text-destructive mt-1">{errors.relationship.message}</p>
        )}
        {selectedRelationship === "Other" && (
          <div className="mt-4">
            <Label htmlFor="relationshipText" className="mb-2 block">Describe the relationship</Label>
            <Input
              id="relationshipText"
              placeholder="Example: My neighbor, my child's teacher…"
              {...register("relationshipText", {
                required: selectedRelationship === "Other" ? "Please describe the relationship." : false,
                minLength: {
                  value: 3,
                  message: "Please provide at least 3 characters for the relationship description.",
                },
              })}
              className={cn(errors.relationshipText && "border-destructive")}
            />
            {errors.relationshipText && (
              <p className="text-sm text-destructive mt-1">{errors.relationshipText.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Age Range */}
      <div>
        <Label htmlFor="ageRange" className="mb-2 block">Age range</Label>
        <Select
          onValueChange={(value) => setValue("ageRange", value, { shouldValidate: true })}
          value={watch("ageRange")}
        >
          <SelectTrigger className={cn(errors.ageRange && "border-destructive")} id="ageRange">
            <SelectValue placeholder="Select an age range" />
          </SelectTrigger>
          <SelectContent>
            {ageRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.ageRange && (
          <p className="text-sm text-destructive mt-1">{errors.ageRange.message}</p>
        )}
      </div>

      {/* Occasion */}
      <div>
        <Label className="mb-2 block">Occasion (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {occasionOptions.map((occasion) => (
            <button
              key={occasion}
              type="button"
              onClick={() => handleOccasionToggle(occasion)}
              className={cn(
                "flex items-center justify-center px-4 py-2 rounded-full border transition-colors",
                selectedOccasions.includes(occasion)
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              )}
            >
              {selectedOccasions.includes(occasion) && <CheckIcon className="mr-2 h-4 w-4" />}
              {occasion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepAboutPerson;