import React, { useEffect, useState } from "react";
import {
  AiFillStar,
  AiOutlineStar,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { fetchReviews } from "@/redux/features/reviewSlice";
import toast, { configure } from 'react-hot-toast'; // Import configure

const ProductCard = ({
  id,
  img,
  category,
  title,
  price,
  discountPrice,
  colors,
  stock,
}) => {
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [stars, setStars] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { reviews, loading: reviewsLoading, error: reviewsError } = useSelector(
    (state) => state.reviews
  );


  useEffect(() => {
    dispatch(fetchReviews(id));
  }, [dispatch, id]);

  useEffect(() => {
    const likedItems = JSON.parse(localStorage.getItem("likedProducts") || "[]");
    setIsLiked(likedItems.includes(id));
  }, [id]);

  useEffect(() => {
    if (reviews && !reviewsLoading && !reviewsError) {
      const productReviews = reviews.filter((review) => review.product === id);
      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const avgRating = totalRating / productReviews.length;
        setAverageRating(avgRating);
        setStars(renderStars(avgRating));
      }
    }
  }, [reviews, id, reviewsLoading, reviewsError]);

  const addProductToCart = (e) => {
    e.stopPropagation();
    const payload = {
      id,
      img,
      category,
      title,
      price,
      discountPrice,
      quantity: 1,
    };
    dispatch(addToCart(payload));
    toast.success("Added to Cart!", {
      id: `add-to-cart-${id}`, // Unique toast ID
    });
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    const likedItems = JSON.parse(localStorage.getItem("likedProducts")) || [];
    const updatedLikedItems = newLikedStatus
      ? [...likedItems, id]
      : likedItems.filter((itemId) => itemId !== id);
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikedItems));
    toast.success(
      newLikedStatus ? "❤️ Added to favorites" : "💔 Removed from favorites",
      {
        id: `like-${id}`, // Unique toast ID
      }
    );
  };


  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(<AiFillStar key={`filled-${i}`} className="text-[#FFB21D] text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(
        <AiFillStar key="half" className="text-[#FFB21D] text-sm opacity-70" />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <AiOutlineStar key={`empty-${i}`} className="text-[#FFB21D] text-sm" />
      );
    }
    return stars;
  };

  const discountPercentage = Math.round(
    ((price - discountPrice) / price) * 100
  );

  return (
    <div
      className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {discountPrice < price && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-md">
          -{discountPercentage}%
        </div>
      )}

      {stock <= 10 && stock > 0 && (
        <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          Only {stock} left
        </div>
      )}

      <Link href={`/product/${id}`} className="block">
        <div className="relative h-48 w-full bg-gray-50">
          <Image
            src={`/images/products/${img}`}
            alt={title}
            fill
            className={`object-contain transition-all duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div
            className={`absolute inset-0 bg-black/5 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        </div>
      </Link>

      <div
        className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <button
          onClick={toggleLike}
          className={`p-2 rounded-full shadow-md transition-colors ${
            isLiked
              ? "bg-red-100 text-red-500"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          {isLiked ? <AiFillHeart className="text-lg" /> : <AiOutlineHeart className="text-lg" />}
        </button>
        <button
          onClick={addProductToCart}
          className={`p-2 rounded-full shadow-md transition-colors ${
            stock <= 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
          aria-label="Add to cart"
          disabled={stock <= 0}
        >
          <AiOutlineShoppingCart className="text-lg" />
        </button>
      </div>

      <div className="p-4">
        <Link href={`/product/${id}`}>
          <div className="mb-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {category}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {colors?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">
              Available Colors:
              </p>
              <div className="flex gap-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-full border border-gray-200`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color: ${color}`}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center mb-2">
            {stars}
            <span className="text-xs text-gray-500 ml-1">
            { averageRating == 0 ? "No Reviews" : <>
              ({averageRating.toLocaleString(undefined, {
                minimumFractionDigits: averageRating % 1 !== 0 ? 1 : 0,
                maximumFractionDigits: 2,
              })})
              </>
}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="font-bold text-red-600 text-lg">
                ${discountPrice}
              </span>
              {price > discountPrice && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  ${price}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                addProductToCart(e);
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                stock <= 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={stock <= 0}
            >
              {stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;