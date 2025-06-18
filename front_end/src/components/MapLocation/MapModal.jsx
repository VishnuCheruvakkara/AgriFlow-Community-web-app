import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';

function MapModal({ lat, lng, onClose }) {
    const [loading, setLoading] = useState(true);

    if (!lat || !lng) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 dark:bg-zinc-900 dark:bg-opacity-80"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.85, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="bg-white dark:bg-zinc-700 w-full max-w-screen-lg h-full rounded-lg shadow-xl overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-700 to-green-400 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Location Details</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-green-600 rounded-full p-1"
                            aria-label="Close modal"
                        >
                            <MdClose size={20} />
                        </button>
                    </div>

                    {/* Loading Spinner */}
                    {loading && (
                        <div className="absolute top-[64px] bottom-0 left-0 right-0 flex items-center justify-center bg-white dark:bg-zinc-700 bg-opacity-80 z-10">
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <PulseLoader color="#16a34a" speedMultiplier={1} />
                                <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
                                    Loading Location...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Google Map Iframe */}
                    <iframe
                        title="Google Map"
                        width="100%"
                        height="100%"
                        className="rounded-b-md"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                        allowFullScreen
                        onLoad={() => setLoading(false)}
                    ></iframe>
                </motion.div>
            </div>
        </div>
    );
}

export default MapModal;
