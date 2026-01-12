"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StepReview = () => {
  const { formData, goToStep, resetFormAndGoToFirstStep } = useGiftAssistant();
  const { watch } = formData;

  const relationship = watch("relationship");
  const relationshipText = watch("relationshipText");
  const ageRange = watch("ageRange");
  const gender = watch("gender"); // Nouveau champ
  const occasion = watch("occasion");
  const personality = watch("personality");
  const interests = watch("interests");
  const interestFreeText = watch("interestFreeText");
  const budget = watch("budget");
  const giftStyle = watch("giftStyle");
  const riskTolerance = watch("riskTolerance");

  const displayRelationship = relationship === "Other" ? relationshipText : relationship;
  const displayOccasion = occasion && occasion.length > 0 ? occasion.join(", ") : "Not specified";
  const displayPersonality = personality && personality.length > 0 ? personality.join(", ") : "Not specified";
  const displayInterests = interests && interests.length > 0 ? interests.join(", ") : "No specific interests";
  const displayInterestFreeText = interestFreeText ? `; "${interestFreeText}"` : "";
  const displayGender = gender && gender !== "Prefer not to say" ? `, ${gender}` : ""; // Afficher le sexe si spécifié

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-2">Does this look right?</h2>
      <p className="text-gray-600 dark:text-gray-400">We’ll use this to search for the best gifts.</p>

      <Card>
        <CardHeader>
          <CardTitle>Your Gift Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">For:</p>
              <p className="text-gray-700 dark:text-gray-300">
                {displayRelationship}, {ageRange}{displayGender}
              </p>
            </div>
            <Button variant="link" onClick={() => goToStep(1)}>Edit</Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Occasion:</p>
              <p className="text-gray-700 dark:text-gray-300">{displayOccasion}</p>
            </div>
            <Button variant="link" onClick={() => goToStep(1)}>Edit</Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Personality:</p>
              <p className="text-gray-700 dark:text-gray-300">{displayPersonality}</p>
            </div>
            <Button variant="link" onClick={() => goToStep(2)}>Edit</Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Interests:</p>
              <p className="text-gray-700 dark:text-gray-300">
                {displayInterests}
                {displayInterestFreeText}
              </p>
            </div>
            <Button variant="link" onClick={() => goToStep(2)}>Edit</Button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Budget & Style:</p>
              <p className="text-gray-700 dark:text-gray-300">
                Budget: {budget}, Style: {giftStyle}
                {riskTolerance ? ", Original gifts: Yes" : ""}
              </p>
            </div>
            <Button variant="link" onClick={() => goToStep(3)}>Edit</Button>
          </div>
        </CardContent>
      </Card>
      <Button variant="link" onClick={resetFormAndGoToFirstStep} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        Start over
      </Button>
    </div>
  );
};

export default StepReview;