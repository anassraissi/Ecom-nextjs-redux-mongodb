const FeatureCard = ({ icon, title, desc, bgColor, iconColor }) => {
  return (
    <div className={`p-6 rounded-xl ${bgColor} transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
      <div className={`flex items-center justify-center h-1 w-14 rounded-lg ${iconColor} mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
};

export default FeatureCard;