import Image from 'next/image';

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
    <div className="container mt-32">
      <div className="flex flex-col lg:flex-row gap-4 pr-[15px]">
        {bannerData.map((banner, index) => (
          <div
            key={index}
            className={`relative h-[200px] md:h-[260px] rounded-xl overflow-hidden w-full lg:w-1/2 flex lg:flex-row-reverse`} // Reversed flex direction
            style={{ backgroundColor: banner.bgColor }}
          >
            <div className="relative lg:w-1/2 h-full"> {/* Image container */}
              <Image
                src={banner.image}
                alt={banner.title}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
            </div>
            <div className="lg:w-1/2 lg:pr-8 lg:py-16 flex flex-col justify-center items-start absolute inset-0 p-8 md:p-16 bg-black/50 lg:bg-transparent"> {/* Text container with absolute positioning */}
              <p className="text-topHeadingSecondary text-xl font-medium text-white lg:text-black">
                {banner.subtitle}
              </p>
              <h2 className="text-topHeadingPrimary font-bold text-xl sm:text-3xl max-w-[240px] text-white lg:text-black">
                {banner.title}
              </h2>
              <a
              className="inline-block bg-white rounded-md px-6 py-3 mt-5 hover:bg-accent hover:text-white"
              href={banner.link}
            >
                {index === 0 ? "Shop Now" : "Learn More"}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;