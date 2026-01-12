"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

const StepRecommendations = () => {
  const {
    giftExplanation,
    recommendations,
    isLoadingMore,
    refetchRecommendations,
    goToStep,
  } = useGiftAssistant();

  const handleFeedback = (productTitle: string, isGoodMatch: boolean) => {
    if (!isGoodMatch) {
      toast.info(`Got it. We’ll show fewer gifts like "${productTitle}".`);
    } else {
      toast.success(`Thanks for the feedback on "${productTitle}"!`);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">Gift ideas picked just for them</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center">
        {giftExplanation || "Based on what you told us, here’s what we found."}
      </p>

      <div className="flex justify-center mb-4">
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          Powered by OpenAI
        </Badge>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p>No recommendations found for your criteria. Try refining your answers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((product, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
              {/* OpenAI currently returns text-based suggestions, no images/URLs directly */}
              <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-bold mb-2">
                €{product.approx_price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-3">{product.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Why it fits: {product.reason}</p>
              <div className="flex items-center justify-between mt-auto">
                <Button variant="outline" size="sm" className="flex-grow mr-2" disabled>
                  View on eBay (Coming Soon)
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleFeedback(product.title, true)} aria-label="Good match">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleFeedback(product.title, false)} aria-label="Not a fit">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <Button
          onClick={refetchRecommendations}
          disabled={isLoadingMore}
          className="min-w-[180px]"
        >
          {isLoadingMore ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            "Show more ideas"
          )}
        </Button>
        <Button variant="link" onClick={() => goToStep(4)}>
          Change my answers
        </Button>
      </div>
    </div>
  );
};

export default StepRecommendations;