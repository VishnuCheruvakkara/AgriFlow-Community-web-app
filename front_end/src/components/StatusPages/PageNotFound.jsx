import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go to the previous page
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white px-4">
      {/* Image Section */}
      <img
        src="/images/404greenError.png"
        alt="404"
        className="mb-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
      />

      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-500">404</h1>
        <p className="text-gray-500 mb-4">Page Not Found</p>

        {/* Back Button */}
        <button
          onClick={goBack}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
