import { AiFillStar, AiOutlineStar, AiOutlineShoppingCart } from "react-icons/ai";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { useState } from "react";
import Image from "next/image"; // Import the Next.js Image component

const ProductCard = ({ id, img, category, title, price }) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const addProductToCart = () => {
    if (quantity > 0) {
      const payload = { id, img, category, title, price, quantity };
      dispatch(addToCart(payload));
      toast.success("Added to Cart!");
    } else {
      toast.error("Quantity must be greater than 0.");
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-72 w-full">
        <Image
          src={`/images/products/${img}`}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Product Details */}
      <div className="p-6">
        {/* Category */}
        <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">
          {category}
        </p>

        {/* Title */}
        <h2 className="font-semibold text-xl mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {title}
        </h2>

        {/* Rating */}
        <div className="flex items-center mb-4">
          {[...Array(4)].map((_, i) => (
            <AiFillStar key={i} className="text-[#FFB21D] text-lg" />
          ))}
          <AiOutlineStar className="text-[#FFB21D] text-lg" />
          <p className="text-gray-600 text-sm ml-2">(3 Reviews)</p>
        </div>

        {/* Price and Quantity Controls */}
        <div className="flex justify-between items-center">
          {/* Price */}
          <p className="font-bold text-2xl text-blue-600">${price}</p>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addProductToCart}
          className="w-full mt-6 bg-blue text-white py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <AiOutlineShoppingCart className="mr-2 text-lg" />
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;