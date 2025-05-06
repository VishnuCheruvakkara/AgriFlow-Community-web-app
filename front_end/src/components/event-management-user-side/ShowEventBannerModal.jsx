import { RxCrossCircled } from "react-icons/rx";
import { motion } from "framer-motion";

const ShowEventBannerModal = ({ imageUrl, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-white rounded-md p-10 max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl"
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
    </motion.div>
  );
};

export default ShowEventBannerModal;
