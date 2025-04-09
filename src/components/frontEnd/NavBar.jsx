import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { BsSearch, BsList } from "react-icons/bs";
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineClose,
} from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Sample categories data
  const categories = [
    {
      name: "Electronics",
      subcategories: ["Smartphones", "Laptops", "Cameras", "Headphones"],
    },
    {
      name: "Fashion",
      subcategories: [
        "Men's Clothing",
        "Women's Clothing",
        "Accessories",
        "Footwear",
      ],
    },
    {
      name: "Home & Kitchen",
      subcategories: ["Furniture", "Appliances", "Cookware", "Home Decor"],
    },
    {
      name: "Beauty",
      subcategories: ["Skincare", "Makeup", "Haircare", "Fragrances"],
    },
    {
      name: "Sports",
      subcategories: ["Fitness", "Outdoor", "Team Sports", "Yoga"],
    },
  ];

  const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "Bose"];

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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    setActiveCategory(null);
  };

  const toggleCategory = (categoryName) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left Side - Menu Button and Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-700 hover:text-blue-600 transition-colors"
            >
              <BsList className="text-2xl" />
            </button>

            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <BsList className="text-xl" />
            </button>

            <div className="flex items-center space-x-2">
              <Image
                src="/logos/iconFront.png"
                alt="logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-gray-800 hidden sm:block">
                Raissi Store
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex w-full max-w-[500px] mx-4">
            <input
              className="border-2 border-gray-300 px-4 py-2 w-full rounded-l-lg focus:outline-none focus:border-blue-500 transition-colors"
              type="text"
              placeholder="Search for products..."
            />
            <button className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700 transition-colors">
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
                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 z-50">
                    {/* Dropdown arrow */}
                    <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white transform rotate-45 border-t border-l border-gray-200" />

                    {/* Dropdown content */}
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                      <div className="p-2 border-b border-gray-100">
                        <div className="px-3 py-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link href="/dashboard">
                          <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <svg
                              className="w-5 h-5 mr-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                              />
                            </svg>
                            Dashboard
                          </button>
                        </Link>

                        <Link href="/orders">
                          <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <svg
                              className="w-5 h-5 mr-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            My Orders
                          </button>
                        </Link>

                        <Link href="/wishlist">
                          <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <svg
                              className="w-5 h-5 mr-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            Wishlist
                          </button>
                        </Link>
                      </div>

                      <div className="py-1 border-t border-gray-100">
                        <button
                          onClick={handleSignOutClick}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 mr-3 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
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
                <div className="hidden md:block">
                  <p
                    className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
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
              className="relative cursor-pointer group"
              onClick={() => setShowCart(true)}
            >
              <div className="rounded-full border-2 border-gray-300 p-2 hover:bg-gray-100 transition-colors">
                <AiOutlineShoppingCart className="text-2xl text-gray-600" />
              </div>
              {cartCount > 0 && (
                <div className="absolute top-[-8px] right-[-8px] bg-red-600 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center">
                  {cartCount}
                </div>
              )}
              <span className="hidden md:block absolute top-full right-0 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                View Cart
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mt-3 mb-2">
          <div className="flex w-full">
            <input
              className="border-2 border-gray-300 px-4 py-2 w-full rounded-l-lg focus:outline-none focus:border-blue-500 transition-colors"
              type="text"
              placeholder="Search for products..."
            />
            <button className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition-colors">
              <BsSearch className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={toggleSidebar}
          ></div>

          {/* Sidebar Content */}
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <AiOutlineClose className="text-xl" />
              </button>
            </div>

            {/* Categories */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name} className="border-b border-gray-100">
                    <button
                      className="w-full flex justify-between items-center py-3 px-2 hover:bg-gray-50 rounded transition-colors"
                      onClick={() => toggleCategory(category.name)}
                    >
                      <span className="font-medium text-gray-700">
                        {category.name}
                      </span>
                      <FiChevronDown
                        className={`transition-transform ${
                          activeCategory === category.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeCategory === category.name && (
                      <ul className="ml-4 py-2 space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <li key={subcategory}>
                            <Link
                              href={`/category/${category.name.toLowerCase()}/${subcategory
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              <button
                                className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded transition-colors text-gray-600"
                                onClick={toggleSidebar}
                              >
                                {subcategory}
                              </button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Brands
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {brands.map((brand) => (
                  <Link key={brand} href={`/brands/${brand.toLowerCase()}`}>
                    <button
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded transition-colors text-gray-600"
                      onClick={toggleSidebar}
                    >
                      {brand}
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/deals">
                    <button
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded transition-colors text-gray-600"
                      onClick={toggleSidebar}
                    >
                      Today''s Deals
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals">
                    <button
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded transition-colors text-gray-600"
                      onClick={toggleSidebar}
                    >
                      New Arrivals
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/customer-service">
                    <button
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded transition-colors text-gray-600"
                      onClick={toggleSidebar}
                    >
                      Customer Service
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Sign Out
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-gray-700"
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
