import { useState } from "react";
import { X, Upload } from "lucide-react";

const AadhaarImageUpload = ({ onImageSelect,purpose }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // File type validation
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only PNG, JPG, and JPEG formats are allowed.");
        setImage(null);
        onImageSelect(null);
        return;
      }

      // File size validation (Max: 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setError("File size must be less than 2MB.");
        setImage(null);
        onImageSelect(null);
        return;
      }

      // Clear previous error
      setError("");

      // Read the file and set the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        onImageSelect(file,purpose);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setError("");
    onImageSelect(null);
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md w-80 bg-white">
        <h2 className="text-lg font-semibold">Upload Aadhaar Image</h2>

        {/* Image Preview Section */}
        {image ? (
          <div className="relative">
            <img src={image} alt="Aadhaar Preview" className="w-64 h-40 object-cover rounded-lg border" />
            <button
              onClick={clearImage}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
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
      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center mt-4 w-full">{error}</p>}
    </div>
  );
};

export default AadhaarImageUpload;
