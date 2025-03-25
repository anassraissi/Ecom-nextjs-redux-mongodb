// src/components/frontEnd/ReviewForm.js
"use client";
import { addReview } from "@/redux/features/reviewSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { StarIcon } from "@heroicons/react/24/solid"; // Import star icon from Heroicons

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(5); // Default rating
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addReview({
        product: productId,
        rating,
        comment, // Add user ID here if needed
      })
    );
    // Clear form after submission
    setRating(5);
    setComment("");
  };

  // Function to handle star rating selection
  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className={`focus:outline-none ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-500 transition-colors duration-200`}
              >
                <StarIcon className="w-8 h-8" />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Share your thoughts about the product..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;