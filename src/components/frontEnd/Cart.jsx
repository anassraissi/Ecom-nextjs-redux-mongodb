import React from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { RxCross1 } from 'react-icons/rx';
import CartProduct from './CartProduct';
import { removeFromCart, updateQuantity } from '@/redux/features/cartSlice'; // Import the update action


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
    <div className="bg-[#0000007d] w-full min-h-screen fixed left-0 top-0 z-20 overflow-y-scroll">
      <div className="max-w-[400px] w-full min-h-full bg-white absolute right-0 top-0 p-6">
        <RxCross1
          className="absolute right-0 top-0 m-6 text-[24px] cursor-pointer"
          onClick={() => setShowCart(false)}
        />
        <h3 className="pt-6 text-lg font-medium text-gray-600 uppercase">
          Your Cart
        </h3>
        <div className="mt-6 space-y-1">
          {products?.map((item) => (
            <div key={item.id} className="flex items-center gap-4"> {/* Container for each product */}
              <CartProduct
                id={item.id}
                img={item.img}
                title={item.title}
                price={item.price}
                quantity={item.quantity}
              />
              <div className="flex items-center ml-auto"> {/* Quantity controls */}
                <button
                  onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                  className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center border border-gray-300 rounded"
                />
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <RxCross1
              className="cursor-pointer"
              onClick={()=>handleRemoveFromCart(item.id)}
            />
            </div>
            
          ))}
        </div>
        <div className="flex justify-between items-center font-medium text-xl py-4">
          <p>Total: {getTotal()}</p>
          <p>${getTotal().toFixed(2)}</p>
        </div>
        <button className="bg-black hover:bg-accent mb-4 mt-4 text-white text-center w-full rounded-3xl py-2">
          View Cart
        </button>
        <button className="bg-black hover:bg-accent text-white text-center w-full rounded-3xl py-2">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;