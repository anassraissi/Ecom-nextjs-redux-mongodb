// src/components/frontEnd/ReviewsDisplay.js
"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { fetchReviews } from "@/redux/features/reviewSlice";
import Skeleton from "react-loading-skeleton"; // For loading state
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton CSS
import { timeAgo } from "../../../utils/timeAgo";

const ReviewsDisplay = ({ productId }) => {
  const dispatch = useDispatch();
  const { reviews, status, error } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  if (status === "loading") {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border p-4 rounded-md">
              <Skeleton height={20} width={100} className="mb-2" /> {/* Star rating skeleton */}
              <Skeleton height={16} count={2} /> {/* Comment skeleton */}
              <Skeleton height={14} width={80} className="mt-2" /> {/* User skeleton */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        <p className="text-red-500">Error loading reviews: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Customer Reviews</h3>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Star Rating */}
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) =>
                  i < review.rating ? (
                    <AiFillStar key={i} className="text-yellow-400 w-5 h-5" />
                  ) : (
                    <AiOutlineStar key={i} className="text-yellow-400 w-5 h-5" />
                  )
                )}
              </div>
              {/* Comment */}
              <p className="text-gray-700 mb-4">{review.comment}</p>

              {/* User Info */}
              {review.user && (
                <p className="text-sm text-gray-500">
                By <span className="font-semibold">{review.user.name} at {timeAgo(review.createdAt)}</span>

                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      )}
    </div>
  );
};

export default ReviewsDisplay;