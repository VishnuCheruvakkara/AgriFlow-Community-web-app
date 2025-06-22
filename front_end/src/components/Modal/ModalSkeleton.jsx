import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import ButtonLoader from "../LoaderSpinner/ButtonLoader";

const ModalSkeleton = ({ isOpen, onClose, title = "", children, onSubmit, isSubmitDisabled = false, }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999]">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-80"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="bg-white dark:bg-zinc-800 w-[1000px] max-w-4xl  h-[670px] rounded-lg shadow-xl overflow-hidden flex flex-col "
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-700 to-green-500 px-6 py-4 flex justify-between items-center flex-shrink-0">
                                <h2 className="text-xl font-semibold text-white">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:bg-green-600 rounded-full p-1"
                                    aria-label="Close modal"
                                >
                                    <AiOutlineClose size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>

                            {/* Footer */}
                            <div className="bg-gray-100 dark:bg-zinc-700 px-6 py-3 flex justify-end gap-3 border-t border-gray-200 dark:border-zinc-600 flex-shrink-0">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-gray-800 dark:text-white rounded-md transition-colors font-medium"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <ButtonLoader 
                                    buttonId = "postConfirmationButton"
                                    type="button"
                                    onClick={onSubmit}
                                    disabled={isSubmitDisabled}
                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${isSubmitDisabled
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-zinc-600 dark:text-zinc-400"
                                            : "bg-green-600 hover:bg-green-700 text-white"
                                        }`}
                                >
                                    Create
                                </ButtonLoader>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ModalSkeleton;
