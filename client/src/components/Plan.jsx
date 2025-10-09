import React from 'react'
import { PricingTable } from '@clerk/clerk-react';

const Plan = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="sm:text-5xl text-gray-700 font-semibold text-3xl">
          Choose Your Plan
        </h1>
        <p className="text-center text-gray-500 mt-5 max-w-xs sm:max-w-xl mb-10">
         Start form free and scale up as you grow. Find the perfect plan for your content creation need.
        </p>
      </div>
      <div className="flex justify-center items-center mx-20 md:mx-64 sm:mb-40 mb-20">
        <PricingTable/>
      </div>
    </>
  );
}

export default Plan
