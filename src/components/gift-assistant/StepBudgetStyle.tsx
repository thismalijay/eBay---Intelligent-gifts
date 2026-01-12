"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const budgetPresets = [
  { label: "€5–10", min: 5, max: 10 },
  { label: "€10–20", min: 10, max: 20 },
  { label: "€20–30", min: 20, max: 30 },
  { label: "€30–50", min: 30, max: 50 },
];

const giftTones = [
  { value: "Safe & neutral", description: "No risk, everyone will find it okay." },
  { value: "Fun & quirky", description: "Light-hearted, a bit playful." },
  { value: "Useful & practical", description: "They’ll actually use it at work or at home." },
];

const StepBudgetStyle = () => {
  const { formData } = useGiftAssistant();
  const { register, watch, setValue, formState: { errors } } = formData;
  const budgetMin = watch("budgetMin");
  const budgetMax = watch("budgetMax");

  const handleBudgetChange = (value: number[]) => {
    setValue("budgetMin", value[0], { shouldValidate: true });
    setValue("budgetMax", value[1], { shouldValidate: true });
  };

  const handlePresetClick = (min: number, max: number) => {
    setValue("budgetMin", min, { shouldValidate: true });
    setValue("budgetMax", max, { shouldValidate: true });
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-2">Budget and gift style</h2>
      <p className="text-gray-600 dark:text-gray-400">We’ll respect your budget and the tone of your office.</p>

      {/* Budget */}
      <div>
        <Label htmlFor="budget-slider" className="mb-4 block">Budget: €{budgetMin} – €{budgetMax}</Label>
        <Slider
          id="budget-slider"
          min={5}
          max={50}
          step={1}
          value={[budgetMin, budgetMax]}
          onValueChange={handleBudgetChange}
          className={cn("w-full", (errors.budgetMin || errors.budgetMax) && "border-destructive")}
        />
        <div className="flex justify-between mt-4 gap-2">
          {budgetPresets.map((preset) => (
            <Button
              key={preset.label}
              variant={budgetMin === preset.min && budgetMax === preset.max ? "default" : "outline"}
              onClick={() => handlePresetClick(preset.min, preset.max)}
              className="flex-1"
            >
              {preset.label}
            </Button>
          ))}
        </div>
        {(errors.budgetMin || errors.budgetMax) && (
          <p className="text-sm text-destructive mt-1">{errors.budgetMin?.message || errors.budgetMax?.message}</p>
        )}
      </div>

      {/* Gift Tone */}
      <div>
        <Label className="mb-2 block">Gift style</Label>
        <RadioGroup
          onValueChange={(value) => setValue("giftTone", value, { shouldValidate: true })}
          value={watch("giftTone")}
          className="grid grid-cols-1 gap-3"
        >
          {giftTones.map((tone) => (
            <Label
              key={tone.value}
              htmlFor={tone.value}
              className={cn(
                "flex flex-col items-start rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                watch("giftTone") === tone.value && "border-primary ring-2 ring-primary"
              )}
            >
              <RadioGroupItem
                value={tone.value}
                id={tone.value}
                className="sr-only"
                {...register("giftTone")}
              />
              <span className="font-semibold">{tone.value}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{tone.description}</span>
            </Label>
          ))}
        </RadioGroup>
        {errors.giftTone && (
          <p className="text-sm text-destructive mt-1">{errors.giftTone.message}</p>
        )}
      </div>
    </div>
  );
};

export default StepBudgetStyle;