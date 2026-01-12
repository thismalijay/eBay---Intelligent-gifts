"use client";

import React from "react";
import { useGiftAssistant } from "./GiftAssistantContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown } from "lucide-react";

// Placeholder for fake product data
const generateFakeProducts = (count: number, seed: number) => {
  const products = [
    {
      title: "Funny 'Meeting Survivor' Coffee Mug",
      price: "€14.99",
      tags: ["Top pick for your colleague", "Office-friendly"],
      explanation: "Because they like coffee and office jokes",
      image: "/placeholder.svg",
    },
    {
      title: "Self-Watering Desk Plant Kit",
      price: "€22.50",
      tags: ["Office-friendly", "Personalizable"],
      explanation: "Great for creative plant lovers with small desks",
      image: "/placeholder.svg",
    },
    {
      title: "Mini Desk Arcade Keychain – Retro Games",
      price: "€18.00",
      tags: ["Fun & quirky", "Geeky"],
      explanation: "Perfect for the gaming enthusiast who needs a desk break",
      image: "/placeholder.svg",
    },
    {
      title: "Ergonomic Gel Wrist Rest for Keyboard",
      price: "€12.99",
      tags: ["Useful & practical", "Office gadgets"],
      explanation: "A thoughtful gift for someone who spends hours typing",
      image: "/placeholder.svg",
    },
    {
      title: "Gourmet Coffee Bean Sampler Pack",
      price: "€29.00",
      tags: ["Food & snacks", "Coffee & tea"],
      explanation: "For the colleague who appreciates a good brew",
      image: "/placeholder.svg",
    },
    {
      title: "Inspirational Desk Calendar 2024",
      price: "€9.50",
      tags: ["Safe & neutral", "Office-friendly"],
      explanation: "A simple yet effective way to brighten their workspace",
      image: "/placeholder.svg",
    },
  ];

  // Simple pseudo-random selection based on seed
  const shuffled = [...products].sort(() => 0.5 - Math.sin(seed));
  return shuffled.slice(0, count);
};

const StepRecommendations = () => {
  const { formData, goToStep, setIsSubmitting } = useGiftAssistant();
  const { getValues } = formData;
  const [recommendations, setRecommendations] = React.useState(() => generateFakeProducts(6, Math.random()));
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const handleShowMoreIdeas = async () => {
    setIsLoadingMore(true);
    // Simulate API call for new ideas
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRecommendations(generateFakeProducts(6, Math.random() * 1000)); // Generate new set
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
        Based on what you told us, here are some options that should feel thoughtful and on-budget.
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
          Change answers
        </Button>
      </div>
    </div>
  );
};

export default StepRecommendations;