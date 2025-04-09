import FeatureCard from "./FeatureCard";
import { RiRefund2Fill } from "react-icons/ri";
import { MdSupportAgent } from "react-icons/md";
import { IconTruckDelivery, IconDiscount2 } from "@tabler/icons-react";

const data = [
  {
    icon: <IconTruckDelivery className="h-10 w-10" />,
    title: "Free Delivery",
    desc: "Orders from all items",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: <RiRefund2Fill className="h-10 w-10" />,
    title: "Return & Refund",
    desc: "Money back guarantee",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: <IconDiscount2 className="h-10 w-10" />,
    title: "Member Discount",
    desc: "On orders over $99.00",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: <MdSupportAgent className="h-10 w-10" />,
    title: "Support 24/7",
    desc: "Contact us anytime",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const Features = () => {
  return (
    <section className="py-1 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, index) => (
            <FeatureCard
              key={index}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
              bgColor={item.bgColor}
              iconColor={item.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;