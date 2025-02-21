import { removeFromCart } from '@/redux/features/cartSlice';
import { useAppDispatch } from '@/redux/hooks';
import { RxCross1 } from 'react-icons/rx';
import Image from 'next/image'; // Import the Next.js Image component

const CartProduct = ({ id, img, title, price, quantity }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex justify-between items-center">
 
      <div className="flex items-center gap-4">
        <div className="relative h-[80px] w-[80px]"> {/* Added width and relative positioning */}
          <Image
            src={`/images/products/${img}`}
            alt={title}
            layout="fill"
            objectFit="contain" // Or "cover" depending on your preference
            className="rounded-md" // Optional: Add rounded corners
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">{title}</h3>
          <p className="text-gray-600 text-[14px]">{quantity} x ${price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;