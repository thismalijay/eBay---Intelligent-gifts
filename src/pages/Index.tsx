"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import GiftHelperHero from "@/components/GiftHelperHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      {/* Standard eBay Shell (Top) - Placeholder */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">eBay</span>
            <nav className="hidden md:flex space-x-4 text-sm">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Saved</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Motors</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Fashion</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Electronics</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">Hi! Sign in</a>
            <a href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">Daily Deals</a>
            <a href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">Help & Contact</a>
            <a href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">Cart</a>
          </div>
        </div>
      </header>

      {/* Search Area - Placeholder */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex flex-col sm:flex-row gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Search for anything"
            className="flex-grow"
          />
          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
            Search
          </Button>
        </div>
      </div>

      <main className="container mx-auto p-4">
        {/* New Hero Module: AI Gift Helper Card */}
        <GiftHelperHero />

        {/* Below the hero: standard eBay content (placeholder) */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Trending Deals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <img src="/placeholder.svg" alt="Product" className="w-full h-32 object-cover mb-2 rounded" />
                <h3 className="font-semibold text-lg">Product Title {i + 1}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-bold">€29.99</p>
                <Button variant="outline" className="mt-2 w-full">View Deal</Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <img src="/placeholder.svg" alt="Product" className="w-full h-32 object-cover mb-2 rounded" />
                <h3 className="font-semibold text-lg">Another Item {i + 1}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-bold">€19.99</p>
                <Button variant="outline" className="mt-2 w-full">Add to Cart</Button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;