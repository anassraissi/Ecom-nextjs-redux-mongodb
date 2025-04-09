"use client";
import React, { useState } from "react";
import { 
  MdDashboard, 
  MdManageAccounts,
  MdInventory,
  MdCategory,
  MdLocalOffer,
  MdBrandingWatermark
} from "react-icons/md";
import { FiSettings, FiUsers, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (title) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const menus = [
    {
      title: "Dashboard",
      icon: <MdDashboard className="text-lg" />,
      href: "/admin/dashboard",
    },
    {
      title: "Inventory",
      icon: <MdInventory className="text-lg" />,
      hasSubMenu: true,
      subMenu: [
        { 
          title: "Products", 
          href: "/admin/items/products",
          icon: <MdInventory className="text-base" />
        },
        { 
          title: "Categories", 
          href: "/admin/items/categories",
          icon: <MdCategory className="text-base" />
        },
        { 
          title: "Brands", 
          href: "/admin/items/brands",
          icon: <MdBrandingWatermark className="text-base" />
        },
        { 
          title: "Sales", 
          href: "/admin/items/sales",
          icon: <MdLocalOffer className="text-base" />
        },
      ],
    },
    {
      title: "Users",
      icon: <FiUsers className="text-lg" />,
      href: "/admin/users",
    },
    {
      title: "Transactions",
      icon: <HiOutlineCurrencyDollar className="text-lg" />,
      href: "/admin/transactions",
    },
    {
      title: "Settings",
      icon: <FiSettings className="text-lg" />,
      href: "/admin/settings",
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Logo Section */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Image 
            src="/logos/logo.png" 
            alt="Raissi Store Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <h2 className="text-lg font-semibold text-gray-800">Raissi Store Admin</h2>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menus.map((menu) => (
            <li key={menu.title}>
              {menu.hasSubMenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(menu.title)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      pathname.includes(menu.title.toLowerCase()) 
                        ? "bg-blue-50 text-blue-600" 
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500">{menu.icon}</span>
                      <span className="text-sm font-medium">{menu.title}</span>
                    </div>
                    {openSubmenus[menu.title] ? (
                      <FiChevronUp className="text-gray-400 text-sm" />
                    ) : (
                      <FiChevronDown className="text-gray-400 text-sm" />
                    )}
                  </button>
                  
                  {openSubmenus[menu.title] && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {menu.subMenu.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            href={subItem.href}
                            className={`flex items-center gap-3 p-2 pl-3 text-sm rounded-lg transition-colors ${
                              pathname === subItem.href
                                ? "bg-blue-100 text-blue-600 font-medium"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                          >
                            <span className="text-blue-400">{subItem.icon}</span>
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={menu.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    pathname === menu.href
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="text-blue-500">{menu.icon}</span>
                  <span className="text-sm font-medium">{menu.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-sm font-medium">AD</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;