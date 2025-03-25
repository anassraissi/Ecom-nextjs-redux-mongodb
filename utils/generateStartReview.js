// utils.js

import { AiFillStar, AiOutlineStar } from "react-icons/ai"; // Import star icons

const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    let stars =[];

    for (let i = 0; i < filledStars; i++) {
        stars.push(<AiFillStar key={`filled-${i}`} className="text-[#FFB21D] text-sm" />);
    }

    if (hasHalfStar) {
        //If you want to add half star add half star icon.
        //stars.push(<AiFillHalfStar key="half" className="text-[#FFB21D] text-sm" />);
    }

    for (let i = 0; i < emptyStars; i++) {
        stars.push(<AiOutlineStar key={`empty-${i}`} className="text-[#FFB21D] text-sm" />);
    }

    return stars;
};

export const getAverageRatingForProduct = (reviews, productId) => {
    if (!reviews) {
        return { averageRating: 0, stars:[]}; // Handle undefined reviews
    }

    const productReviews = reviews.filter((review) => review.product === productId);

    if (productReviews.length === 0) {
        return { averageRating: 0, stars:[]};
    }

    const totalRating = productReviews.reduce(
        (sum, review) => sum + review.rating,
        0
    );
    const averageRating = totalRating / productReviews.length;
    const stars = renderStars(averageRating);

    return { averageRating, stars };
};