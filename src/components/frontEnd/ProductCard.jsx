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
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-lg"> {/* Added shadow and hover effect */}
      <div className="relative h-64 w-full"> {/* Increased image height, set width */}
        <Image
          src={`/images/products/${img}`}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg" // Round top corners
        />
      </div>
      <div className="p-6"> {/* Increased padding */}
        <p className="text-gray-500 text-sm mb-2 uppercase">{category}</p> {/* Smaller, uppercase category */}
        <h2 className="font-medium text-lg mb-2 line-clamp-2">{title}</h2> {/* Larger title, line clamping */}
        <div className="flex items-center mb-3"> {/* Added margin bottom */}
          {[...Array(4)].map((_, i) => ( // Render filled stars
            <AiFillStar key={i} className="text-[#FFB21D] text-sm" />
          ))}
          <AiOutlineStar className="text-[#FFB21D] text-sm" /> {/* Render one outline star */}
          <p className="text-gray-600 text-xs ml-2">3 Reviews</p> {/* Smaller review text */}
        </div>
        <div className="flex justify-between items-center">
          <div> {/* Group price and quantity controls */}
            <p className="font-medium text-accent text-xl">${price}</p>
            <div className="flex items-center mt-2"> {/* Added margin top for spacing */}
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100" // Added hover effect
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center border border-gray-300 rounded"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100" // Added hover effect
              >
                +
              </button>
            </div>
          </div>
          <div
            className="bg-blue hover:bg-pink-700 text-white px-2 py-2 mt-8 rounded-md cursor-pointer transition duration-300" // Improved button styles
            onClick={addProductToCart}
          >
            <AiOutlineShoppingCart className="inline-block mr-2" /> {/* Icon inside button */}
            Add To Cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;