import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { BsSearch } from "react-icons/bs";
import { AiOutlineUser, AiOutlineShoppingCart } from 'react-icons/ai';
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { setUser } from "@/redux/features/userSlice";

const Navbar = ({ setShowCart }) => {
  const cartCount = useAppSelector((state) => state.cartReducer.length);
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  console.log(session);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  useEffect(() => {
    console.log("Session:", session);
    console.log("Status:", status);
    if (session && session.user) {
        dispatch(setUser(session.user));
    } else if (status === 'unauthenticated') {
        dispatch(setUser(null));
    }
}, [session, dispatch, status]);

  const handleUserIconClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleSignOutClick = () => {
    setShowSignOutModal(true);
    setShowUserMenu(false);
  };

  const handleConfirmSignOut = () => {
    signOut();
    setShowSignOutModal(false);
  };

  const handleCloseSignOutModal = () => {
    setShowSignOutModal(false);
  };


  return (
    <nav className="pt-4 bg-white sticky top-0 z-10 relative">
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="text-4xl font-bold">Logo</div>
          <div className="lg:flex hidden w-full max-w-[500px]">
            <input
              className="border-2 border-accent px-6 py-2 w-full"
              type="text"
              placeholder="Search for products..."
            />
            <div className="bg-accent text-white text-[26px] grid place-items-center px-4">
              <BsSearch />
            </div>
          </div>
          <div className="flex gap-4 md:gap-8 items-center">
            {status === "authenticated" ? (
              <div className="md:flex items-center relative group">
                <div
                  className="rounded-full border-2 border-gray-300 text-gray-500 text-[32px] h-[50px] w-[50px] grid place-items-center cursor-pointer flex items-center justify-center transition-colors duration-300 hover:bg-gray-100"
                  onClick={handleUserIconClick}
                >
                  <AiOutlineUser className="text-[32px] transition-colors duration-300 group-hover:text-gray-700" />
                </div>
                <span
                  className="ml-2 text-gray-500 cursor-pointer text-base md:text-lg font-medium transition-colors duration-300 group-hover:text-gray-700"
                  onClick={handleUserIconClick}
                >
                  {session.user.name}
                </span>

                {showUserMenu && (
                  <div className="absolute top-full right-0 bg-white shadow-md rounded-md p-4 z-10 w-48">
                    <Link href="/dashboard">
                      <button className="block w-full text-left py-2 hover:bg-gray-100 rounded-md">
                        Dashboard
                      </button>
                    </Link>
                    <button
                      className="block w-full text-left py-2 hover:bg-gray-100 rounded-md"
                      onClick={handleSignOutClick}
                    >
                      Sign Out
                    </button>
                  </div>
                )}

                {showSignOutModal && (
                  <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md">
                      <p>Are you sure you want to sign out?</p>
                      <div className="mt-4 flex justify-end">
                        <button
                          className="bg-gray-200 px-4 py-2 rounded-md mr-2"
                          onClick={handleCloseSignOutModal}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-md"
                          onClick={handleConfirmSignOut}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="md:flex gap-3 items-center">
                <button
                  className="rounded-full border-2 border-gray-300 text-gray-500 text-[32px] h-[50px] w-[50px] grid place-items-center"
                  onClick={() => signIn()}
                >
                  <AiOutlineUser />
                </button>
                <div>
                  <p className="text-gray-500 cursor-pointer" onClick={() => signIn()}>
                    Hello, Sign in
                  </p>
                  <p className="font-medium">Your Account</p>
                </div>
              </div>
            )}

            <div
              className="text-gray-500 text-[32px] relative cursor-pointer"
              onClick={() => setShowCart(true)}
            >
              <AiOutlineShoppingCart />
              {cartCount > 0 && (
                <div className="absolute top-[-15px] right-[-10px] bg-red-600 w-[25px] h-[25px] rounded-full text-white text-[14px] grid place-items-center">
                  {cartCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;