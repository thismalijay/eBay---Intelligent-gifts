"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

// Placeholder for fake product data
const generateFakeProducts = (count: number, seed: number, formData: any) => {
  const { relationship, ageRange, interests, budget, giftStyle } = formData;
  const baseExplanation = `For your ${relationship} (${ageRange}), who likes ${interests.length > 0 ? interests.join(", ") : "general items"}. Budget: ${budget}, Style: ${giftStyle}.`;

  const products = [
    {
      title: "Smart Coffee Mug Warmer with Auto Shut-Off",
      price: "€24.99",
      tags: ["Useful", "Tech & gadgets", "Coffee & tea"],
      explanation: `A practical gift for a ${relationship} who enjoys hot beverages.`,
      image: "/placeholder.svg",
    },
    {
      title: "Personalized Leather Journal",
      price: "€35.00",
      tags: ["Special & thoughtful", "Books & reading", "Creative"],
      explanation: `A thoughtful gift for a ${relationship} who appreciates writing or sketching.`,
      image: "/placeholder.svg",
    },
    {
      title: "Miniature Desk Zen Garden Kit",
      price: "€18.50",
      tags: ["Calm", "Home & decor", "Office-friendly"],
      explanation: `Perfect for a ${relationship} who enjoys a moment of calm at their desk.`,
      image: "/placeholder.svg",
    },
    {
      title: "Gourmet Snack Box - International Selection",
      price: "€29.99",
      tags: ["Food & cooking", "Fun & playful"],
      explanation: `A fun and tasty treat for a ${relationship} who loves trying new foods.`,
      image: "/placeholder.svg",
    },
    {
      title: "Portable Bluetooth Speaker - Waterproof",
      price: "€49.99",
      tags: ["Tech & gadgets", "Music & audio", "Adventurous"],
      explanation: `Great for a ${relationship} who enjoys music on the go or outdoors.`,
      image: "/placeholder.svg",
    },
    {
      title: "Funny 'World's Best Boss' Desk Plaque",
      price: "€12.00",
      tags: ["Fun & playful", "Colleague / Boss"],
      explanation: `A light-hearted gift for a ${relationship} with a good sense of humor.`,
      image: "/placeholder.svg",
    },
  ];

  // Simple pseudo-random selection based on seed
  const shuffled = [...products].sort(() => 0.5 - Math.sin(seed));
  return shuffled.slice(0, count).map(product => ({
    ...product,
    explanation: product.explanation.replace(
      /a \$\{(\w+)\}/g,
      (_, key) => `a ${formData[key] || 'person'}`
    ),
  }));
};

const StepRecommendations = () => {
  const { formData, goToStep, setIsSubmitting, resetFormAndGoToFirstStep } = useGiftAssistant();
  const { getValues } = formData;
  const [recommendations, setRecommendations] = React.useState(() => generateFakeProducts(6, Math.random(), getValues()));
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const handleShowMoreIdeas = async () => {
    setIsLoadingMore(true);
    // Simulate API call for new ideas
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRecommendations(generateFakeProducts(6, Math.random() * 1000, getValues())); // Generate new set
    setIsLoadingMore(false);
    toast.success("New gift ideas loaded!");
  };

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
        Based on what you told us, here’s what we found.
      </p>

      <div className="flex justify-center mb-4">
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          Powered by eBay AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((product, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
            <img src={product.image} alt={product.title} className="w-full h-32 object-cover mb-3 rounded" />
            <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
            <p className="text-blue-600 dark:text-blue-400 font-bold mb-2">{product.price}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {product.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-3">{product.explanation}</p>
            <div className="flex items-center justify-between mt-auto">
              <Button variant="outline" size="sm" className="flex-grow mr-2">View on eBay</Button>
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

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <Button
          onClick={handleShowMoreIdeas}
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