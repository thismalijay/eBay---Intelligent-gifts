"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const occasions = [
  { value: "Secret Santa at work", label: "Secret Santa at work" },
  { value: "Birthday at work", label: "Birthday at work" },
  { value: "Holiday gift exchange", label: "Holiday gift exchange" },
  { value: "Thank you gift", label: "Thank you gift" },
  { value: "Other", label: "Other" },
];

const relationships = [
  { value: "Teammate", label: "Teammate" },
  { value: "Manager", label: "Manager" },
  { value: "Direct report", label: "Direct report" },
  { value: "Other colleague", label: "Other colleague" },
];

const ageRanges = [
  { value: "18–24", label: "18–24" },
  { value: "25–34", label: "25–34" },
  { value: "35–44", label: "35–44" },
  { value: "45–54", label: "45–54" },
  { value: "55+", label: "55+" },
  { value: "I’m not sure", label: "I’m not sure" },
];

const StepAboutPerson = () => {
  const { formData } = useGiftAssistant();
  const { register, watch, setValue, formState: { errors } } = formData;
  const selectedOccasion = watch("occasion");

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-2">Who is it for?</h2>
      <p className="text-gray-600 dark:text-gray-400">Just a few details help us avoid awkward gifts.</p>

      {/* Occasion */}
      <div>
        <Label htmlFor="occasion" className="mb-2 block">Occasion</Label>
        <Select
          onValueChange={(value) => {
            setValue("occasion", value, { shouldValidate: true });
            if (value !== "Other") {
              setValue("occasionText", "");
            }
          }}
          value={selectedOccasion}
        >
          <SelectTrigger className={cn(errors.occasion && "border-destructive")} id="occasion">
            <SelectValue placeholder="Select an occasion" />
          </SelectTrigger>
          <SelectContent>
            {occasions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.occasion && (
          <p className="text-sm text-destructive mt-1">{errors.occasion.message}</p>
        )}
        {selectedOccasion === "Other" && (
          <div className="mt-4">
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
      </div>

      {/* Relationship */}
      <div>
        <Label className="mb-2 block">Relationship</Label>
        <RadioGroup
          onValueChange={(value) => setValue("relationship", value, { shouldValidate: true })}
          value={watch("relationship")}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          {relationships.map((rel) => (
            <Label
              key={rel.value}
              htmlFor={rel.value}
              className={cn(
                "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                watch("relationship") === rel.value && "border-primary ring-2 ring-primary"
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
    </div>
  );
};

export default StepAboutPerson;