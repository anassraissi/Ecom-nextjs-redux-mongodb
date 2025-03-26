import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { getSales } from "@/redux/features/saleSlice";
import { motion } from "framer-motion";

const Hero = () => {
  const dispatch = useDispatch();
  const { sales, loading, error } = useSelector((state) => state.sales);
  const [hasCheckedSales, setHasCheckedSales] = useState(false);

  // Get the most relevant sale (featured > active > first available)
  const sale = useMemo(() => {
    return sales?.find(s => s.isFeatured) || sales?.find(s => s.isActive) || sales?.[0];
  }, [sales]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        await dispatch(getSales({ isActive: true, isFeatured: true })).unwrap();
      } finally {
        setHasCheckedSales(true);
      }
    };
    fetchSales();
  }, [dispatch]);

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (sale?.originalPrice && sale?.salePrice) {
      const original = parseFloat(sale.originalPrice);
      const discounted = parseFloat(sale.salePrice);
      if (original > 0 && discounted >= 0) {
        return ((original - discounted) / original * 100).toFixed(0);
      }
    }
    return null;
  }, [sale]);

  // Calculate urgency indicators
  const timeRemaining = sale?.saleEndDate ? Math.max(0, new Date(sale.saleEndDate) - new Date()) : null;
  const daysRemaining = timeRemaining ? Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)) : null;
  const stockPercentage = sale?.stockQuantity ? Math.floor((sale.stockQuantity / (sale.usageLimit || 100)) * 100) : null;

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div className="h-6 w-24 bg-blue-400 bg-opacity-30 rounded-full animate-pulse"></div>
              <div className="h-10 w-full bg-blue-400 bg-opacity-30 rounded animate-pulse"></div>
              <div className="h-5 w-3/4 bg-blue-400 bg-opacity-30 rounded animate-pulse"></div>
              <div className="h-8 w-32 bg-blue-400 bg-opacity-30 rounded animate-pulse"></div>
              <div className="flex gap-3 mt-4">
                <div className="h-10 w-28 bg-white bg-opacity-30 rounded-lg animate-pulse"></div>
                <div className="h-10 w-28 bg-blue-400 bg-opacity-30 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="h-48 md:h-72 bg-blue-400 bg-opacity-30 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-red-300">Error loading promotions</p>
        </div>
      </div>
    );
  }

  // Only show empty state after confirming no sales exist
  if (!sale && hasCheckedSales) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 text-center animate-fadeIn">
        <div className="container mx-auto px-4">
          <p className="text-blue-200">Check back soon for exciting deals!</p>
        </div>
      </div>
    );
  }

  // Don't render anything while waiting for initial data
  if (!sale) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-sky-950 to-sky-200 py-6 md:py-8 relative overflow-hidden">
      {/* Urgency Indicators */}
      <div className="absolute top-2 right-2 flex gap-2 z-20">
        {daysRemaining && (
          <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
            ⏳ {daysRemaining} DAY{daysRemaining !== 1 ? 'S' : ''} LEFT
          </span>
        )}
        {sale.stockQuantity && (
          <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
            🚀 {stockPercentage && stockPercentage < 30 ? 'SELLING FAST' : 'LIMITED STOCK'}
          </span>
        )}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-white"
          >
            {/* Badge & Sale Type */}
            <div className="flex flex-wrap gap-1">
              <span className="bg-white text-blue px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide">
                {sale.saleType || 'LIMITED OFFER'}
              </span>
              {sale.couponCode && (
                <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  CODE: {sale.couponCode}
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {sale.title}
              {sale.occasion && (
                <span className="block text-lg text-blue-200 font-normal mt-1">
                  {sale.occasion} Collection
                </span>
              )}
            </h1>

            {/* Description */}
            <p className="text-base text-blue-100 max-w-lg">{sale.description}</p>

            {/* Bonus Offer */}
            {sale.bonus?.bonusTitle && (
              <div className="bg-white bg-opacity-10 p-3 rounded-lg border border-white border-opacity-20 backdrop-blur-sm">
                <p className="font-bold text-yellow-300 text-sm">✨ {sale.bonus.bonusTitle}</p>
                {sale.bonus.bonusDescription && (
                  <p className="text-blue-100 text-xs mt-1">{sale.bonus.bonusDescription}</p>
                )}
              </div>
            )}

            {/* Price & Savings */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">${sale.salePrice}</span>
                {sale.originalPrice && (
                  <span className="text-lg text-blue-200 line-through">${sale.originalPrice}</span>
                )}
              </div>
              {discountPercentage && (
                <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  SAVE ${(sale.originalPrice - sale.salePrice).toFixed(2)} ({discountPercentage}%)
                </span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue hover:bg-blue-600 hover:text-blue px-6 py-2 text-base font-bold rounded-lg shadow-lg transition-all"
              >
                🛒 Shop Now
              </motion.button>
            </div>
          </motion.div>

          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-48 md:h-72"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="h-full w-full relative"
            >
              <Image
                src={sale.image ? `/images/sales/${sale.image}` : "/placeholder-product.png"}
                alt={sale.title}
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-blue-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;