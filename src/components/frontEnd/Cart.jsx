import React from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RxCross1 } from "react-icons/rx";
import CartProduct from "./CartProduct";
import { removeFromCart, updateQuantity } from "@/redux/features/cartSlice";

const Cart = ({ setShowCart }) => {
    const products = useAppSelector((state) => state.cartReducer);
    const dispatch = useAppDispatch();

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id));
    };

    const getTotal = () => {
        let total = 0;
        products.forEach((item) => (total += item.price * item.quantity));
        return total;
    };

    const handleQuantityChange = (id, newQuantity) => {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Your Cart</h3>
                    <RxCross1
                        className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
                        onClick={() => setShowCart(false)}
                    />
                </div>

                {/* Cart Items */}
                <div className="p-6">
                    {products.length === 0 ? (
                        <p className="text-gray-600 text-center">Your cart is empty.</p>
                    ) : (
                        <div className="space-y-6">
                            {products.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    {/* Product Image and Details */}
                                    <CartProduct
                                        id={item.id}
                                        img={item.img}
                                        alt={item.title}
                                        title={item.title}
                                        price={item.price}
                                        quantity={item.quantity}
                                        color={item.color} // Pass the color prop
                                    />

                                    {/* Quantity Controls */}
                                    <div className="flex items-center ml-auto space-x-2">
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(item.id, Math.max(1, item.quantity - 1))
                                            }
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    item.id,
                                                    Math.max(1, parseInt(e.target.value) || 1)
                                                )
                                            }
                                            className="w-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <RxCross1
                                        className="text-xl text-gray-600 cursor-pointer hover:text-red-600 transition-colors"
                                        onClick={() => handleRemoveFromCart(item.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {products.length > 0 && (
                    <div className="p-6 border-t border-gray-200">
                        {/* Total */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-lg font-semibold text-gray-800">Total:</p>
                            <p className="text-xl font-bold text-blue-600">
                                ${getTotal().toFixed(2)}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-4">
                            <button
                                className="w-full bg-blue text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View Cart
                            </button>
                            <button
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;