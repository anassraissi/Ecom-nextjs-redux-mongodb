// CartProduct.js (Example)
import React from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { RxCross1 } from 'react-icons/rx';
import Image from 'next/image';
import { removeFromCart } from '@/redux/features/cartSlice';

const CartProduct = ({ id, img, title, price, quantity, color }) => {
    const dispatch = useAppDispatch();

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id));
    };
    return (
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
                <div className="relative h-20 w-20">
                    <Image
                        src={`/images/products/${img}`}
                        alt={title}
                        layout="fill"   
                        objectFit="contain"
                        className="rounded-md"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/placeholder.png";
                        }}
                    />
                </div>
                <div className="space-y-2">
                    <h3 className="font-medium text-gray-800">{title}</h3>
                    <p className="text-gray-600 text-sm">
                        {quantity} x ${price.toFixed(2)}
                    </p>
                    {color && <p className="text-gray-500 text-xs">Color: {color}</p>}
                    {/* Display color if available */}
                </div>
            </div>
        </div>
    );
};

export default CartProduct;