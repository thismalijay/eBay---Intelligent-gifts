"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const budgetPresets = [
  { value: "Under 10", label: "Under €10" },
  { value: "10-25", label: "€10–25" },
  { value: "25-50", label: "€25–50" },
  { value: "50-100", label: "€50–100" },
  { value: "100+", label: "€100+" },
];

const giftStyles = [
  { value: "Safe & classic", description: "Can’t go wrong." },
  { value: "Useful", description: "Something practical they’ll use." },
  { value: "Fun & playful", description: "Something that makes them smile." },
  { value: "Special & thoughtful", description: "More personal, a bit more emotional." },
];

const StepBudgetStyle = () => {
  const { formData } = useGiftAssistant();
  const { register, watch, setValue, formState: { errors } } = formData;
  const selectedBudget = watch("budget");
  const selectedGiftStyle = watch("giftStyle");
  const riskTolerance = watch("riskTolerance");

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-2">What kind of gift do you want?</h2>
      <p className="text-gray-600 dark:text-gray-400">We’ll keep ideas within your budget and style.</p>

      {/* Budget */}
      <div>
        <Label className="mb-2 block">Budget</Label>
        <div className="flex flex-wrap justify-between gap-2">
          {budgetPresets.map((preset) => (
            <Button
              key={preset.value}
              variant={selectedBudget === preset.value ? "default" : "outline"}
              onClick={() => setValue("budget", preset.value, { shouldValidate: true })}
              className="flex-1 min-w-[80px]"
            >
              {preset.label}
            </Button>
          ))}
        </div>
        {errors.budget && (
          <p className="text-sm text-destructive mt-1">{errors.budget.message}</p>
        )}
      </div>

      {/* Gift Style */}
      <div>
        <Label className="mb-2 block">Gift style</Label>
        <RadioGroup
          onValueChange={(value) => setValue("giftStyle", value, { shouldValidate: true })}
          value={selectedGiftStyle}
          className="grid grid-cols-1 gap-3"
        >
          {giftStyles.map((style) => (
            <Label
              key={style.value}
              htmlFor={style.value}
              className={cn(
                "flex flex-col items-start rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                selectedGiftStyle === style.value && "border-primary ring-2 ring-primary"
              )}
            >
              <RadioGroupItem
                value={style.value}
                id={style.value}
                className="sr-only"
                {...register("giftStyle")}
              />
              <span className="font-semibold">{style.value}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{style.description}</span>
            </Label>
          ))}
        </RadioGroup>
        {errors.giftStyle && (
          <p className="text-sm text-destructive mt-1">{errors.giftStyle.message}</p>
        )}
      </div>

      {/* Risk Tolerance Toggle */}
      <div className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4">
        <Label htmlFor="risk-tolerance" className="flex flex-col cursor-pointer">
          <span className="font-semibold">I’m okay with slightly more original gifts</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">This might include less conventional suggestions.</span>
        </Label>
        <Switch
          id="risk-tolerance"
          checked={riskTolerance}
          onCheckedChange={(checked) => setValue("riskTolerance", checked)}
          {...register("riskTolerance")}
        />
      </div>
    </div>
  );
};

export default StepBudgetStyle;