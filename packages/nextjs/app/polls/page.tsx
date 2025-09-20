"use client";

import React, { useState } from "react";
import { CategoryTabs } from "~~/components/CategoryTabs";
import { PollSwiper } from "~~/components/PollSwiper";

export default function PollsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Trending");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleCreateMockPoll = async () => {
    try {
      const response = await fetch("/api/polls/mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        console.log("Mock poll created:", result.poll);
        alert("Mock poll created successfully!");
        // Trigger refresh of polls
        setRefreshTrigger(prev => prev + 1);
      } else {
        console.error("Failed to create mock poll:", result.message);
        alert("Failed to create mock poll");
      }
    } catch (error) {
      console.error("Error creating mock poll:", error);
      alert("Error creating mock poll");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Category Navigation Tabs */}
      <CategoryTabs onCategoryChange={handleCategoryChange} />

      {/* Poll Swiper Interface */}
      <div className="flex-1 bg-base-200">
        <PollSwiper selectedCategory={selectedCategory} refreshTrigger={refreshTrigger} />
      </div>

      {/* Floating Mock Button */}
      <button
        onClick={handleCreateMockPoll}
        className="fixed bottom-6 right-6 btn btn-circle btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        title="Create Mock Poll"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}