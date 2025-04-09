"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getSales } from '@/redux/features/saleSlice';

const EcommerceBanner = () => {
  const dispatch = useDispatch();
  const { salesTypeBanner : sales, loading, error } = useSelector((state) => state.sales);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const banners = sales?.filter(sale => sale.type === "banner") || [];

  // Format banner data
  const formatBannerData = (banner) => ({
    id: banner._id,
    image: `/images/sales/${banner.image}`,
    title: banner.title,
    description: banner.description,
    link: banner.link || "#",
    occasion: banner.occasion,
    isFeatured: banner.isFeatured,
    bgColor: banner.bgColor || "#f8fafc",
    textColor: banner.textColor || "#0f172a"
  });

  // Fetch data
  useEffect(() => {
    dispatch(getSales({ type: "banner" }));
  }, [dispatch]);

  // Auto-rotate
  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, isHovered]);

  if (loading) return <BannerSkeleton />;
  if (error) return <ErrorBanner />;
  if (banners.length === 0) return <NoBannersAvailable />;

  return (
    <div 
      className="container mx-auto px-4 mt-8 md:mt-12 lg:mt-1 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          >
            <FiChevronLeft className="text-gray-800 text-xl" />
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          >
            <FiChevronRight className="text-gray-800 text-xl" />
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${currentSlide === index ? 'bg-blue w-6' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}

      <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {banners.map((banner, index) => (
            currentSlide === index && (
              <BannerSlide 
                key={banner._id} 
                data={formatBannerData(banner)} 
              />
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const BannerSlide = ({ data }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="absolute inset-0 w-full h-full"
    style={{ backgroundColor: data.bgColor }}
  >
    <div className="relative h-full w-full flex flex-col lg:flex-row">
      {/* Text Content */}
      <div className="relative z-10 w-full lg:w-1/2 h-full flex flex-col justify-center p-8 md:p-12 lg:p-16">
        {data.isFeatured && (
          <motion.span 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-3 py-1 bg-white text-blue-600 text-xs font-bold rounded-full uppercase tracking-wide mb-4"
          >
            Featured
          </motion.span>
        )}

        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          style={{ color: data.textColor }}
        >
          {data.title}
        </motion.h1>

        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg mt-4 max-w-lg"
          style={{ color: data.textColor }}
        >
          {data.description}
        </motion.p>

        {data.occasion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mt-4"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span style={{ color: data.textColor }}>{data.occasion}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Link
            href={data.link}
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Discover More
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Image */}
      <div className="absolute lg:relative right-0 top-0 w-full lg:w-1/2 h-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="h-full w-full relative"
        >
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover lg:object-contain object-right"
            priority
          />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

const BannerSkeleton = () => (
  <div className="container mx-auto px-4 mt-8 md:mt-12 lg:mt-16">
    <div className="h-[300px] md:h-[400px] lg:h-[500px] bg-gray-200 rounded-xl overflow-hidden relative animate-pulse">
      <div className="absolute inset-0 flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 h-full p-8 flex flex-col justify-center space-y-4">
          <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
          <div className="h-12 w-64 bg-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-12 w-32 bg-gray-300 rounded mt-4"></div>
        </div>
        <div className="hidden lg:block w-1/2 h-full bg-gray-300"></div>
      </div>
    </div>
  </div>
);

const ErrorBanner = () => (
  <div className="container mx-auto px-4 mt-8 bg-red-50 p-8 rounded-lg text-center">
    <p className="text-red-500">Error loading banner content</p>
  </div>
);

const NoBannersAvailable = () => (
  <div className="container mx-auto px-4 mt-8 bg-blue-50 p-8 rounded-lg text-center">
    <p className="text-blue-600">No active promotions available</p>
  </div>
);

export default EcommerceBanner;