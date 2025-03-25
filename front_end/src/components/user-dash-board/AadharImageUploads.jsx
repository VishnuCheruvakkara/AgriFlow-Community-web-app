import { useState } from "react";
import { X, Upload } from "lucide-react";

const AadhaarImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md w-80 bg-white">
      <h2 className="text-lg font-semibold">Upload Aadhaar Image</h2>
      {image ? (
        <div className="relative">
          <img src={image} alt="Aadhaar Preview" className="w-64 h-40 object-cover rounded-lg border" />
          <button
            onClick={clearImage}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
          <Upload size={24} className="text-gray-500" />
          <span className="text-sm text-gray-500">Select Aadhaar Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      )}
    </div>
  );
};

export default AadhaarImageUpload;
