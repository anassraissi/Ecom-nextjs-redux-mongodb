export const calculateAverageRating = (reviews, productId) => {
    if (!reviews || reviews.length === 0) return 0;
    
    const productReviews = reviews.filter((review) => review.product === productId);
    if (productReviews.length === 0) return 0;
    
    const totalRating = productReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return totalRating / productReviews.length;
  };
  
  export const getProductReviews = (reviews, productId) => {
    return reviews?.filter(review => review.product === productId) || [];
  };
  
  export const renderStars = (averageRating) => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} filled />
        ))}
        {hasHalfStar && <Star key="half" half />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} />
        ))}
        <span className="ml-1 text-sm text-gray-600">
          ({averageRating.toFixed(1)})
        </span>
      </div>
    );
  };
  
  // Star component (can be in the same file or separate)
  const Star = ({ filled, half }) => {
    return (
      <svg
        className={`w-4 h-4 ${filled ? 'text-yellow-400' : half ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {half ? (
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        ) : (
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        )}
      </svg>
    );
  };