import React from "react";
import Image from "next/image"; // Import the Next.js Image component

const Hero = () => {
  return (
    <div className="bg-[#E3EDF6] py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-600">
              Starting at{" "}
              <span className="font-bold text-blue-600">$999.00</span>
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              The Best Notebook Collection 2023
            </h1>

            <h3 className="text-2xl text-gray-700 font-['Oregano', cursive]">
              Exclusive Offer{" "}
              <span className="text-red-600 font-bold">-10% Off</span> This Week
            </h3>

            <a
              href="#"
              className="inline-block bg-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Shop Now
            </a>
          </div>

          {/* Right Column: Image */}
          <div className="flex justify-end">
            <Image
              src="/images/hero.png"
              alt="Hero Image"
              width={400}
              height={600}
              className="rounded-lg shadow-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;