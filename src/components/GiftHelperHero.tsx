"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GiftAssistantModal } from "./GiftAssistantModal";

const GiftHelperHero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg overflow-hidden mb-8 p-6 md:p-0">
      {/* Desktop: Two columns */}
      <div className="hidden md:flex md:flex-row">
        {/* Left: Illustration/Photo */}
        <div className="md:w-1/2 flex items-center justify-center p-8">
          {/* Placeholder for illustration/photo */}
          <img
            src="/placeholder.svg" // Using a placeholder image
            alt="Colleagues exchanging gifts in an office during holidays"
            className="max-h-64 w-full object-cover rounded-md"
          />
        </div>
        {/* Right: Content */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-3">Need help finding a gift?</h1>
          <p className="text-lg mb-6 max-w-md">
            Describe your colleague and your budget. Our AI will find Secret
            Santa gifts that feel thoughtful, not random.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-full text-lg shadow-md transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
              onClick={() => setIsModalOpen(true)}
            >
              Find a gift with AI
            </Button>
            <a
              href="/gift-ideas" // Placeholder link
              className="text-white text-sm underline hover:no-underline"
            >
              Browse all gift ideas
            </a>
          </div>
        </div>
      </div>

      {/* Tablet/Mobile: Stacked layout */}
      <div className="md:hidden flex flex-col">
        {/* Top: Illustration/Photo */}
        <div className="flex items-center justify-center p-6 pb-0">
          <img
            src="/placeholder.svg" // Using a placeholder image
            alt="Colleagues exchanging gifts in an office during holidays"
            className="max-h-48 w-full object-cover rounded-md"
          />
        </div>
        {/* Bottom: Content */}
        <div className="p-6 flex flex-col justify-center text-center">
          <h1 className="text-3xl font-bold mb-2">Need help finding a gift?</h1>
          <p className="text-base mb-5">
            Describe your colleague and your budget. Our AI will find Secret
            Santa gifts that feel thoughtful, not random.
          </p>
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-full text-lg shadow-md transition-all duration-200 ease-in-out w-full mb-3 focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
            onClick={() => setIsModalOpen(true)}
          >
            Find a gift with AI
          </Button>
          <a
            href="/gift-ideas" // Placeholder link
            className="text-white text-sm underline hover:no-underline"
          >
            Browse all gift ideas
          </a>
        </div>
      </div>

      <GiftAssistantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default GiftHelperHero;