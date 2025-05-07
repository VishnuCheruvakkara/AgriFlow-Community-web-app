import { RxCrossCircled } from "react-icons/rx";
import { motion } from "framer-motion";
import { useEffect } from "react";

const ShowEventBannerModal = ({ imageUrl, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    // Save original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on body
    document.body.style.overflow = "hidden";
    
    // Restore original overflow on cleanup
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
   <div className="fixed inset-0 w-full h-full z-[9999]" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Full screen overlay */}
      <div 
        className="fixed inset-0 w-full h-full bg-black bg-opacity-80" 
        onClick={onClose}
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Modal content */}
      <div className="fixed inset-0 w-full h-full flex items-center justify-center p-4" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
        <motion.div
          className="relative bg-white rounded-md p-10 max-w-3xl w-full mx-auto"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10"
            aria-label="Close modal"
          >
            <RxCrossCircled className="text-gray-500 text-3xl hover:text-gray-700 transition-colors" />
          </button>
          
          {/* Modal Image */}
          <img
            src={imageUrl}
            alt="Large View"
            className="w-full h-auto rounded-md shadow-lg"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ShowEventBannerModal;