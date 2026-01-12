"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StepReview = () => {
  const { formData, goToStep } = useGiftAssistant();
  const { watch } = formData;

  const occasion = watch("occasion");
  const occasionText = watch("occasionText");
  const relationship = watch("relationship");
  const ageRange = watch("ageRange");
  const interests = watch("interests");
  const interestFreeText = watch("interestFreeText");
  const budgetMin = watch("budgetMin");
  const budgetMax = watch("budgetMax");
  const giftTone = watch("giftTone");

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-2">Review your answers</h2>
      <p className="text-gray-600 dark:text-gray-400">Check everything before we search for gifts.</p>

      <Card>
        <CardHeader>
          <CardTitle>Your Gift Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Occasion:</p>
              <p className="text-gray-700 dark:text-gray-300">
                {occasion === "Other" ? occasionText : occasion}
              </p>
            </div>
            <Button variant="link" onClick={() => goToStep(1)}>Edit</Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Recipient:</p>
              <p className="text-gray-700 dark:text-gray-300">
                {relationship}, {ageRange}
              </p>
            </div>
            <Button variant="link" onClick={() => goToStep(1)}>Edit</Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Interests:</p>
              <p className="text-gray-700 dark:text-gray-300">
                {interests && interests.length > 0 ? interests.join(", ") : "No specific interests"}
                {interestFreeText && (interests && interests.length > 0 ? "; " : "") + interestFreeText}
              </p>
            </div>
            <Button variant="link" onClick={() => goToStep(2)}>Edit</Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Budget & Style:</p>
              <p className="text-gray-700 dark:text-gray-300">
                Budget: €{budgetMin}–€{budgetMax}, Style: {giftTone}
              </p>
            </div>
            <Button variant="link" onClick={() => goToStep(3)}>Edit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepReview;