"use client";
import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Return Policy</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>30-day return policy for unused items</li>
        <li>Original tags must be attached</li>
        <li>Customer is responsible for return shipping costs</li>
        <li>Refunds will be processed within 5 business days of receipt</li>
      </ul>
    </div>
  );
};

export default ReturnPolicy;