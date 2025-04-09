import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPinterest } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FiPhone } from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";
import { BsShieldCheck } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { MdPayment } from "react-icons/md";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Footer links data
  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "New Arrivals", href: "/new-arrivals" },
        { name: "Best Sellers", href: "/best-sellers" },
        { name: "Deals & Promotions", href: "/deals" },
        { name: "Gift Cards", href: "/gift-cards" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQs", href: "/faqs" },
        { name: "Shipping Info", href: "/shipping" },
        { name: "Returns & Exchanges", href: "/returns" },
      ],
    },
    {
      title: "About Us",
      links: [
        { name: "Our Story", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 border-b border-gray-800 pb-8">
          <div className="flex items-center space-x-3">
            <RiCustomerService2Line className="text-2xl text-blue-400" />
            <div>
              <h4 className="font-medium text-white">24/7 Support</h4>
              <p className="text-sm">Dedicated support</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BsShieldCheck className="text-2xl text-green-400" />
            <div>
              <h4 className="font-medium text-white">Secure Payments</h4>
              <p className="text-sm">100% protected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <GiReturnArrow className="text-2xl text-purple-400" />
            <div>
              <h4 className="font-medium text-white">Easy Returns</h4>
              <p className="text-sm">30-day policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MdPayment className="text-2xl text-yellow-400" />
            <div>
              <h4 className="font-medium text-white">Multiple Payment</h4>
              <p className="text-sm">Options available</p>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Newsletter Subscription */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">Subscribe to Newsletter</h3>
            <p className="text-sm mb-4">
              Get updates on special offers and promotions
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2">Contact Us</h4>
              <div className="flex items-center space-x-2 mb-2">
                <IoMdMail className="text-blue-400" />
                <span>support@raissistore.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="text-blue-400" />
                <span>+1 (800) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Dynamic Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-bold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h4 className="text-white font-medium mb-3">We Accept</h4>
          <div className="flex flex-wrap gap-3">
            {['visa', 'mastercard', 'amex', 'paypal', 'applePay'].map((method) => (
              <div
                key={method}
                className="bg-gray-800 rounded-md p-2 w-16 h-10 flex items-center justify-center"
              >
                <img
                  src={`../logos/${method}.svg`}
                  alt={method}
                  className="max-h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex space-x-5">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-600 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterest className="h-5 w-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-xs text-gray-500">
                &copy; {currentYear} Raissi Store. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookie-policy"
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-white transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App Banner */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="text-white font-medium">Download Our Mobile App</h4>
              <p className="text-sm text-gray-400">
                Shop on the go with exclusive mobile-only deals
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors">
                <img src="../logos/app-store.svg" alt="App Store" className="h-6" />
                App Store
              </button>
              <button className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors">
                <img src="../logos/playstore.svg" alt="Play Store" className="h-6" />
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;