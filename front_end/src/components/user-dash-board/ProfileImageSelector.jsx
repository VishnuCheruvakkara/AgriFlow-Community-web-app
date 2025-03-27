import React, { useState } from "react";
import { AiOutlineEdit, AiOutlinePlus, AiOutlineClose } from "react-icons/ai";

const ProfileImageSelector = ({onImageSelect}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    onImageSelect(null);
  };

  return (
    <div className="relative w-32 h-32">
      {/* Profile Image / Placeholder */}
      <label className="w-32 h-32 rounded-full border-4 border-green-700 border-dashed flex items-center justify-center cursor-pointer overflow-hidden relative">
        {selectedImage ? (
          <img src={selectedImage} alt="Profile" className="w-full h-full object-cover  border-4 border-white rounded-full" />
        ) : (
          <AiOutlinePlus size={40} className="text-gray-500" />
        )}
        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
      </label>

      {/* Edit & Remove Icons */}
      {selectedImage ? (
        <>
          {/* Edit Icon */}
         
          {/* Remove Icon */}
          <div
            className="absolute top-1 right-1 bg-red-500 p-2 rounded-full text-white cursor-pointer"
            onClick={removeImage}
          >
            <AiOutlineClose size={12} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProfileImageSelector;
