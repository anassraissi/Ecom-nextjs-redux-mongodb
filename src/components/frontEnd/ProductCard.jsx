import { AiFillStar, AiOutlineStar, AiOutlineShoppingCart, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { fetchReviews } from "@/redux/features/reviewSlice";

const ProductCard = ({ id, img, category, title, price, discountPrice }) => {
    const dispatch = useAppDispatch();
    const [isLiked, setIsLiked] = useState(false);
    const [stars, setStars] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        dispatch(fetchReviews(id));
    }, [dispatch, id]);

    const { reviews} = useSelector((state) => state.reviews);

    useEffect(() => {
        if (reviews) {
            const productReviews = reviews.filter((review) => review.product === id);
            if (productReviews.length === 0) {
                setAverageRating(0);
                setStars([...stars]);
                return;
            }
            
            const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
            const avgRating = totalRating / productReviews.length;
            setAverageRating(avgRating);
            setStars(renderStars(avgRating));
        }
    }, [reviews, id]);

    const addProductToCart = (e) => {
        e.stopPropagation();
        const payload = { id, img, category, title, price, quantity: 1 };
        dispatch(addToCart(payload));
        toast.success("Added to Cart!");
    };

    const toggleLike = (e) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
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
            //If you want to add half star add half star icon.
            //stars.push(<AiFillHalfStar key="half" className="text-[#FFB21D] text-sm" />);
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<AiOutlineStar key={`empty-${i}`} className="text-[#FFB21D] text-sm" />);
        }

        return stars;
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
                <Link href={`/product/${id}`} key={id} className="block">
                    <div className="relative h-48 w-full">
                        <Image
                            src={`/images/products/${img}`}
                            alt={title}
                            layout="fill"
                            objectFit="contain"
                            objectPosition="center"
                            className="rounded-t-lg"
                        />
                    </div>
                    <div className="p-3">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                            {category}
                        </p>
                        <h2 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                            {title}
                        </h2>
                        <div className="flex items-center mb-2">
                            {stars}
                        </div>
                        <div className="flex items-center">
                            <p className="font-bold text-red-600 text-lg mr-2">${discountPrice}</p>
                            <p className="text-black text-xs line-through">${price}</p>
                        </div>
                    </div>
                </Link>
                <button
                    onClick={addProductToCart}
                    className="absolute top-2 right-2 bg-blue text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                    <AiOutlineShoppingCart className="text-lg" />
                </button>
                <button
                    onClick={toggleLike}
                    className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                    {isLiked ? <AiFillHeart className="text-lg" /> : <AiOutlineHeart className="text-lg" />}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;