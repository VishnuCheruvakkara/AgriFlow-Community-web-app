import { useState, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";

const BannerImageUpload = ({ onImageSelect, purpose, defaultImage }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null); // Create a reference to the file input

  // Only set the preview image if a defaultImage exists and preview is not already set
  useEffect(() => {
    if (defaultImage) {
      setPreviewUrl(defaultImage); // Set the default image for preview
    }
  }, [defaultImage]);

  // Handle image file change
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
        onImageSelect(file, purpose); // Send the file to the parent component
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreviewUrl(null); // Clear preview URL as well
    setError("");
    onImageSelect(null); // Clear the image selection in the parent component

    // Reset the file input so that a new file can be selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Determine the label based on the 'purpose' prop
  const getLabel = () => {
    switch (purpose) {
      case "userBanner":
        return "Upload User Banner";
      case "communityBanner":
        return "Upload Community Banner";
      case "eventBanner":
        return "Upload Event Banner";
      default:
        return "Upload Banner";
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md w-80 bg-white">
        <h2 className="text-lg font-semibold">{getLabel()}</h2>

        {/* Image Preview Section */}
        {previewUrl || image ? (
          <div className="relative">
            <img
              src={previewUrl || image} // Use defaultImage if it exists, else use uploaded image
              alt={`${purpose} Preview`}
              className="w-full h-40 object-cover rounded-lg border"
            />
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
            <span className="text-sm text-gray-500">Select {getLabel()}</span>
            <input
              ref={fileInputRef} // Attach ref to the file input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>
      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center mt-4 w-full">{error}</p>}
    </div>
  );
};

export default BannerImageUpload;
