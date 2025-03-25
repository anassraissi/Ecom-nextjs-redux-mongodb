import Image from 'next/image';
import Link from 'next/link';

const Banner = () => {
  const bannerData = [
    {
      image: "/images/banner/banner1.png",
      title: "Smartphone BLU G91 Pro 2023",
      subtitle: "Sale 26% off all store",
      link: "#",
      bgColor: "#e3edf6",
    },
    {
      image: "/images/banner/banner2.png",
      title: "Apple iPhone 16 Pro Max",
      subtitle: "Pre-order Now",
      link: "#",
      bgColor: "#e3edf6",
    },
  ];

  return (
    <div className="container mx-auto px-4 mt-32">
      <div className="flex flex-col lg:flex-row gap-6">
        {bannerData.map((banner, index) => (
          <div
            key={index}
            className={`relative h-[200px] md:h-[300px] rounded-xl overflow-hidden w-full lg:w-1/2 group`}
            style={{ backgroundColor: banner.bgColor }}
          >
            {/* Text Container (Left Side) */}
            <div className="absolute inset-0 w-full lg:w-1/2 flex flex-col justify-center items-start p-8 md:p-16 z-10">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {banner.subtitle}
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
                {banner.title}
              </h2>
              <Link
                href={banner.link}
                className="inline-block bg-white text-gray-900 rounded-lg px-8 py-3 mt-4 font-medium transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-lg"
              >
                {index === 0 ? "Shop Now" : "Learn More"}
              </Link>
            </div>

            {/* Image Container (Right Side) */}
            <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full transform transition-transform duration-500 group-hover:scale-105">
              <Image
                src={banner.image}
                alt={banner.title}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;