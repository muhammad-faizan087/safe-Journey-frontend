"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Star, Send, User } from "lucide-react";
import Button from "../components/Button";

const FeedbackComponent = () => {
  const [newFeedback, setNewFeedback] = useState({
    rating: 0,
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // Mock feedback data
  const feedbackList = [
    {
      id: 1,
      userName: "Sarah Johnson",
      userAvatar: "/profile.svg",
      rating: 5,
      comment:
        "Amazing experience! The app made it so easy to find reliable travel companions. I felt completely safe throughout my journey and made a new friend too!",
      date: "2024-01-15",
      verified: true,
    },
    {
      id: 2,
      userName: "Mike Chen",
      userAvatar: "/profile.svg",
      rating: 4,
      comment:
        "Great concept and execution. The verification process gives me confidence in the safety of other users. Only minor suggestion would be to add more filter options.",
      date: "2024-01-12",
      verified: true,
    },
    {
      id: 3,
      userName: "Emma Davis",
      userAvatar: "/profile.svg",
      rating: 5,
      comment:
        "This app has revolutionized how I travel to and from campus. The safety features are top-notch and the community is very welcoming. Highly recommended!",
      date: "2024-01-10",
      verified: true,
    },
    {
      id: 4,
      userName: "Alex Rodriguez",
      userAvatar: "/profile.svg",
      rating: 4,
      comment:
        "Very useful for finding travel companions. The messaging system works well and I appreciate the emergency contact features.",
      date: "2024-01-08",
      verified: false,
    },
    {
      id: 5,
      userName: "Jessica Lee",
      userAvatar: "/profile.svg",
      rating: 5,
      comment:
        "Excellent app! As a female student, safety is my top priority and SafeJourney delivers on all fronts. The verification process is thorough and the user interface is intuitive.",
      date: "2024-01-05",
      verified: true,
    },
  ];

  const handleRatingClick = (rating) => {
    setNewFeedback({ ...newFeedback, rating });
  };

  const handleRatingHover = (rating) => {
    setHoveredRating(rating);
  };

  const postfeedback = async (ratings, comment) => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/feedback",
        {
          method: "POST",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserName,
            ratings,
            comment,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (newFeedback.rating > 0 && newFeedback.comment.trim()) {
      console.log("Submitting feedback:", newFeedback);
      await postfeedback();
      setNewFeedback({ rating: 0, comment: "" });
      setHoveredRating(0);
      // Here you would typically send the feedback to your backend
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating, interactive = false, size = "sm") => {
    const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} cursor-pointer transition-colors ${
              star <=
              (interactive ? hoveredRating || newFeedback.rating : rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onClick={interactive ? () => handleRatingClick(star) : undefined}
            onMouseEnter={
              interactive ? () => handleRatingHover(star) : undefined
            }
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">User Feedback</h2>
        <p className="text-sm sm:text-base text-gray-600">
          See what our community says about SafeJourney
        </p>
      </div>

      {/* Feedback List */}
      <div className="space-y-4 mb-8">
        {feedbackList.map((feedback, index) => (
          <motion.div
            key={feedback.id}
            className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, translateY: "-20%" }}
            whileInView={{
              opacity: 1,
              translateY: "0",
              transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1,
              },
            }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col gap-3">
              {/* User Info Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={feedback.userAvatar || "/placeholder.svg"}
                    alt={feedback.userName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm sm:text-base truncate">
                        {feedback.userName}
                      </h4>
                      {feedback.verified && (
                        <div
                          className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"
                          title="Verified User"
                        ></div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      {renderStars(feedback.rating)}
                      <span className="text-xs sm:text-sm text-gray-500">
                        {formatDate(feedback.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Comment */}
              <div className="pl-0 sm:pl-13">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                  {feedback.comment}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit New Feedback Form */}
      <motion.div
        className="border-t pt-6"
        initial={{ opacity: 0, translateY: "20%" }}
        whileInView={{
          opacity: 1,
          translateY: "0",
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        }}
        viewport={{ once: true }}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          Share Your Experience
        </h3>

        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          {/* Rating Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Rate your experience
            </label>
            <div className="flex items-center gap-2">
              {renderStars(newFeedback.rating, true, "md")}
              <span className="text-sm text-gray-600 ml-2">
                {newFeedback.rating > 0 && (
                  <>
                    {newFeedback.rating} star
                    {newFeedback.rating !== 1 ? "s" : ""}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Comment Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your feedback
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about your experience with SafeJourney..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base resize-none"
              value={newFeedback.comment}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, comment: e.target.value })
              }
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {newFeedback.comment.length}/500 characters
              </span>
              {newFeedback.rating === 0 && (
                <span className="text-xs text-red-500">
                  Please select a rating
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setNewFeedback({ rating: 0, comment: "" });
                setHoveredRating(0);
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600"
              disabled={newFeedback.rating === 0 || !newFeedback.comment.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default FeedbackComponent;
