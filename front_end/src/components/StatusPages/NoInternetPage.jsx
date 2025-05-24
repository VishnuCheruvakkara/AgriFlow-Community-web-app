import React from "react";
import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";

const NoInternetPage = () => {
  const handleRefresh = () => {
    window.location.reload(); // Refreshes the current page
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white px-4 text-center">
     

      {/* Image */}
      <img
        src="/images/noInternetBug.png"
        alt="No Internet"
        className="mb-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
      />

      {/* Icon and Title */}
      <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
        <MdOutlineSignalWifiStatusbarConnectedNoInternet4 className="text-3xl" />
        No Internet Connection
      </h1>

      {/* Description */}
      <p className="text-gray-500 mt-2 mb-6">
        Please check your internet connection and try again.
      </p>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
      >
        Refresh Page
      </button>
    </div>
  );
};

export default NoInternetPage;
