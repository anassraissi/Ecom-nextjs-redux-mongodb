"use client";
import React from "react";

const DeliveryInfo = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Delivery Information</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>Free standard delivery on orders over $50</li>
        <li>Express delivery available for an additional charge</li>
        <li>Estimated delivery time: 2-5 business days</li>
        <li>We ship to most countries worldwide</li>
      </ul>
    </div>
  );
};

export default DeliveryInfo;