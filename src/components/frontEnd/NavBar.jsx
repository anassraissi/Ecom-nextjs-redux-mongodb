import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { BsSearch } from "react-icons/bs";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { setUser } from "@/redux/features/userSlice";
import Image from "next/image";

const Navbar = ({ setShowCart }) => {
  const cartCount = useAppSelector((state) => state.cartReducer.length);
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  useEffect(() => {
    if (session && session.user) {
      dispatch(setUser(session.user));
    } else if (status === "unauthenticated") {
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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/logos/iconFront.png"
              alt="logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-gray-800">Raissi Store</span>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex w-full max-w-[500px]">
            <input
              className="border-2 border-gray-300 px-4 py-2 w-full rounded-l-lg focus:outline-none focus:border-blue-500 transition-colors"
              type="text"
              placeholder="Search for products..."
            />
            <button className="bg-blue text-white px-6 rounded-r-lg hover:bg-blue-700 transition-colors">
              <BsSearch className="text-xl" />
            </button>
          </div>

          {/* User and Cart Icons */}
          <div className="flex items-center space-x-6">
            {/* User Icon */}
            {status === "authenticated" ? (
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer group"
                  onClick={handleUserIconClick}
                >
                  <div className="rounded-full border-2 border-gray-300 p-2 hover:bg-gray-100 transition-colors">
                    <AiOutlineUser className="text-2xl text-gray-600" />
                  </div>
                  <span className="hidden md:block text-gray-600 font-medium">
                    {session.user.name}
                  </span>
                </div>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-48 z-50">
                    <Link href="/dashboard">
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg">
                        Dashboard
                      </button>
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
                      onClick={handleSignOutClick}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  className="rounded-full border-2 border-gray-300 p-2 hover:bg-gray-100 transition-colors"
                  onClick={() => signIn()}
                >
                  <AiOutlineUser className="text-2xl text-gray-600" />
                </button>
                <div>
                  <p
                    className="text-gray-600 hover:text-blue-600 cursor-pointer"
                    onClick={() => signIn()}
                  >
                    Hello, Sign in
                  </p>
                  <p className="text-sm text-gray-500">Your Account</p>
                </div>
              </div>
            )}

            {/* Cart Icon */}
            <div
              className="relative cursor-pointer"
              onClick={() => setShowCart(true)}
            >
              <AiOutlineShoppingCart className="text-2xl text-gray-600 hover:text-blue-600 transition-colors" />
              {cartCount > 0 && (
                <div className="absolute top-[-10px] right-[-10px] bg-red-600 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center">
                  {cartCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg text-gray-800">Are you sure you want to sign out?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={handleCloseSignOutModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                onClick={handleConfirmSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;