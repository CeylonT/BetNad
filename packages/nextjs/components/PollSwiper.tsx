"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";

// Poll data structure matching API response
interface Poll {
  _id: string;
  description: string;
  category: string;
  verifierRule: string;
  createdBy: string;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  createdAt: string;
  expiresAt?: string;
  status: string;
  twitterPostId?: string;
  updatedAt: string;
}

interface PollCardProps {
  poll: Poll;
  onSwipe: (direction: 'left' | 'right' | 'skip') => void;
  isTop: boolean;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onSwipe, isTop }) => {
  const controls = useAnimation();
  const constraintsRef = useRef(null);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 150;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= threshold) {
      if (offset > 0) {
        // Swipe right - Yes
        controls.start({ x: 1000, rotate: 30, opacity: 0 });
        setTimeout(() => onSwipe('right'), 150);
      } else {
        // Swipe left - No
        controls.start({ x: -1000, rotate: -30, opacity: 0 });
        setTimeout(() => onSwipe('left'), 150);
      }
    } else {
      // Snap back to center
      controls.start({ x: 0, rotate: 0, opacity: 1 });
    }
  };

  const getYesPercentage = () => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((poll.yesVotes / poll.totalVotes) * 100);
  };

  const getTimeRemaining = () => {
    if (!poll.expiresAt) return "No expiry";

    const now = new Date();
    const expiry = new Date(poll.expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h left`;
    }

    return `${hours}h ${minutes}m left`;
  };

  return (
    <motion.div
      ref={constraintsRef}
      className={`absolute inset-0 ${isTop ? 'z-10' : 'z-0'}`}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.8 }}
      animate={controls}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileDrag={{ rotate: 0 }}
      style={{ touchAction: "none" }}
    >
      <div className={`w-full h-full bg-base-100 rounded-xl shadow-lg border border-base-300 p-6 flex flex-col ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-primary text-primary-content text-xs rounded-full font-medium">
              {poll.category}
            </span>
            <span className="text-xs text-base-content/60">
              {getTimeRemaining()}
            </span>
          </div>
          <div className="text-xs text-base-content/60">
            {poll.totalVotes} votes
          </div>
        </div>

        {/* Poll Question */}
        <div className="flex-1 flex items-center justify-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-center leading-relaxed text-base-content">
            {poll.description}
          </h2>
        </div>

        {/* Verification Rule */}
        <div className="bg-info/10 dark:bg-info/20 rounded-lg p-3 mb-4 border border-info/20">
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-info" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-info font-medium">Verification:</span>
          </div>
          <p className="text-sm text-base-content mt-1">{poll.verifierRule}</p>
        </div>

        {/* Current Results */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2 text-base-content">
            <span>Current Results</span>
            <span className="font-medium">{getYesPercentage()}% Yes</span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${getYesPercentage()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-base-content/70 mt-1">
            <span>{poll.yesVotes} Yes</span>
            <span>{poll.noVotes} No</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onSwipe('left')}
            className="flex-1 btn btn-error btn-outline gap-2"
            disabled={!isTop}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            No
          </button>

          <button
            onClick={() => onSwipe('skip')}
            className="btn btn-circle btn-ghost"
            disabled={!isTop}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <button
            onClick={() => onSwipe('right')}
            className="flex-1 btn btn-success btn-outline gap-2"
            disabled={!isTop}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Yes
          </button>
        </div>

        {/* Swipe Indicators */}
        {isTop && (
          <>
            <motion.div
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-error text-error-content px-4 py-2 rounded-lg font-bold text-lg opacity-0 shadow-lg"
              animate={{ opacity: 0 }}
              id="no-indicator"
            >
              NO
            </motion.div>
            <motion.div
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-success text-success-content px-4 py-2 rounded-lg font-bold text-lg opacity-0 shadow-lg"
              animate={{ opacity: 0 }}
              id="yes-indicator"
            >
              YES
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

interface PollSwiperProps {
  selectedCategory?: string | null;
  refreshTrigger?: number;
}

export const PollSwiper: React.FC<PollSwiperProps> = ({ selectedCategory, refreshTrigger }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch polls from API
  const fetchPolls = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/polls?limit=50'); // Fetch more polls for better experience
      const data = await response.json();

      if (data.success) {
        setPolls(data.polls);
      } else {
        setError(data.message || 'Failed to fetch polls');
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
      setError('Failed to load polls');
    } finally {
      setIsLoading(false);
    }
  };

  // Load polls on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchPolls();
  }, [refreshTrigger]);

  // Filter polls based on selected category
  const filteredPolls = React.useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") {
      return polls;
    }
    if (selectedCategory === "Trending") {
      // For trending, show polls with highest vote counts
      return [...polls].sort((a, b) => b.totalVotes - a.totalVotes);
    }
    if (selectedCategory === "New") {
      // For new, show polls sorted by creation date (newest first)
      return [...polls].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    // Filter by specific category
    return polls.filter(poll => poll.category === selectedCategory);
  }, [polls, selectedCategory]);

  // Reset current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const handleSwipe = (direction: 'left' | 'right' | 'skip') => {
    const currentPoll = filteredPolls[currentIndex];

    console.log(`${direction.toUpperCase()} on poll:`, currentPoll.description);

    // Move to next poll
    setCurrentIndex(prev => prev + 1);

    // TODO: Send vote to API when implementing actual voting
    // if (direction !== 'skip') {
    //   sendVote(currentPoll.id, direction === 'right' ? 'yes' : 'no');
    // }
  };

  const resetPolls = () => {
    setCurrentIndex(0);
  };

  // Show remaining polls (max 2 visible)
  const visiblePolls = filteredPolls.slice(currentIndex, currentIndex + 2);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content">Loading polls...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2 text-base-content">Error Loading Polls</h2>
          <p className="text-base-content/70 mb-4">{error}</p>
          <button onClick={fetchPolls} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No polls state
  if (polls.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2 text-base-content">No Polls Available</h2>
          <p className="text-base-content/70 mb-4">Create some polls to get started!</p>
          <button onClick={fetchPolls} className="btn btn-primary">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= filteredPolls.length) {
    const categoryText = selectedCategory && selectedCategory !== "All"
      ? `in ${selectedCategory}`
      : "";

    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2 text-base-content">All caught up!</h2>
          <p className="text-base-content/70 mb-4">
            You've reviewed all available polls {categoryText}.
          </p>
          <button onClick={resetPolls} className="btn btn-primary">
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full max-w-md mx-auto p-4">
      <div className="relative w-full h-[600px]">
        {visiblePolls.map((poll, index) => (
          <PollCard
            key={poll._id}
            poll={poll}
            onSwipe={handleSwipe}
            isTop={index === 0}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm text-base-content/70">
          Swipe left for <span className="text-error font-medium">No</span>,
          right for <span className="text-success font-medium">Yes</span>,
          or tap skip to pass
        </p>
      </div>
    </div>
  );
};