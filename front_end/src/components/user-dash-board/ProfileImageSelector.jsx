import React, { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";

const ProfileImageSelector = ({ onImageSelect, reset, initialImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  console.log("initial image ::::", initialImage)

  useEffect(() => {
    if (reset) {
      setSelectedImage(null);
      setError("");
    }
  }, [reset]);

  // Show initial image only if selectedImage is not set
  const displayImage = selectedImage || (initialImage ? initialImage : null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only PNG, JPG, and JPEG formats are allowed.");
        setSelectedImage(null);
        onImageSelect(null);
        return;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File size must be less than 2MB.");
        setSelectedImage(null);
        onImageSelect(null);
        return;
      }

      setError("");
      setSelectedImage(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setError("");
    onImageSelect(null);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Profile Image Upload Area */}
      <div className="relative w-32 h-32">
        <label className="w-32 h-32 rounded-full border-2 border-dashed 
                      border-gray-400 dark:border-zinc-600 
                      hover:border-green-700 dark:hover:border-green-500 
                      flex items-center justify-center cursor-pointer 
                      overflow-hidden transition duration-300">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              className="w-full h-full object-cover border-4 border-white dark:border-zinc-800 rounded-full"
            />
          ) : (
            <AiOutlinePlus size={40} className="text-gray-500 dark:text-zinc-400" />
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        {/* Remove Image Button */}
        {displayImage && (
          <button
            className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full 
                   text-white shadow-md hover:bg-red-600 transition duration-200"
            onClick={removeImage}
          >
            <AiOutlineClose size={14} />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-5 text-center w-full dark:text-red-400">
          {error}
        </p>
      )}
    </div>

  );
};

export default ProfileImageSelector;
