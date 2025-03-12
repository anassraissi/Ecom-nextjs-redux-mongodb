"use client";
import React, { useState } from "react";
import { MdDashboard, MdManageAccounts } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { IoAnalytics, IoSettings } from "react-icons/io5";
import { RiShoppingCartLine } from "react-icons/ri";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { setLoading } from "@/redux/features/loadingSlice";

const Sidebar = () => {
  const pathname = usePathname();
  const [isProductsOpen, setIsProductsOpen] = useState(false); // State to toggle the submenu

  const menus = [
    {
      title: "Dashboard",
      icon: <MdDashboard />,
      href: "/admin/dashboard",
    },
    {
      title: "Manages Containers",
      icon: <RiShoppingCartLine />,
      href: "#",
      hasSubMenu: true,
      subMenu: [
        { title: "Products", href: "/admin/items/products" },
        { title: "Categories", href: "/admin/items/categories" },
        { title: "Brands", href: "/admin/items/brands" },
      ],
    },
    {
      title: "Account",
      icon: <MdManageAccounts />,
      href: "/admin/users",
    },
    {
      title: "Transactions",
      icon: <GrTransaction />,
      href: "",
    },
    {
      title: "Settings",
      icon: <IoSettings />,
      href: "",
    },
  ];
  return (
    <div className="bg-white w-[300px] min-h-screen p-4 shrink-0">
      <div className="flex items-center gap-4">
        <img className="size-12 rounded-lg" src="/logos/logo.png" alt="logo" />
        <h2 className="text-[20px] font-semibold">The Raissi Dashboard EcomeStore</h2>
      </div>
      <ul className="space-y-4 mt-6">
        {menus.map((menu) => (
          <div key={menu.title}>
            <Link
              href={menu.href || "#"}
              onClick={() => {
                if (menu.hasSubMenu) {
                  setIsProductsOpen((prev) => !prev);
                }
              }}
              className={`flex gap-2 items-center p-4 rounded-lg cursor-pointer hover:bg-blue hover:text-white ${
                pathname === menu.href ? " bg-blue text-white" : "bg-gray-200"
              }`}
            >
              <div className="text-[20px]">{menu.icon}</div>
              <p>{menu.title}</p>
              {menu.hasSubMenu && (
                <div className="ml-auto">
                  {isProductsOpen ? <AiOutlineUp /> : <AiOutlineDown />}
                </div>
              )}
            </Link>
            {menu.hasSubMenu && isProductsOpen && (
              <ul className="pl-8 mt-2 space-y-2">
                {menu.subMenu.map((subMenuItem) => (
                  <li key={subMenuItem.title}>
                    <Link
                      href={subMenuItem.href}
                      className={`block p-2 rounded-lg cursor-pointer hover:bg-blue hover:text-white ${
                        pathname === subMenuItem.href
                          ? "bg-blue text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {subMenuItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
