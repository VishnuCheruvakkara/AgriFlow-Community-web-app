import { RxCrossCircled } from "react-icons/rx";
import { motion } from "framer-motion";
import { useEffect } from "react";

const ShowEventBannerModal = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full z-[9999] flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-90"
      onClick={onClose} // Close when clicking anywhere on background
    >
      <motion.div
        className="relative bg-white dark:bg-zinc-800 rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
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
          <RxCrossCircled className="text-gray-500 text-3xl hover:text-gray-700 dark:hover:text-red-500 transition-colors" />
        </button>

        {/* Modal Image */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt="Large View"
            className="max-h-[75vh] w-auto object-contain rounded-md shadow-lg"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ShowEventBannerModal;
