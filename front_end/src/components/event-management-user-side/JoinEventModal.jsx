import React from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { FaRegCircleCheck } from 'react-icons/fa6';

function JoinEventModal({title = "Edit Event", onClose,onSubmit, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {children}
                </div>

                {/* Footer */}
                <div className="bg-gray-100 px-6 py-3 flex justify-end gap-3 border-t border-gray-200">
                    <button
                        type="button"
                        className="px-4 py-3 bg-gray-400 hover:bg-gray-500 text-gray-800 rounded-md transition-colors font-medium flex items-center gap-2"
                        onClick={onClose}
                    >
                        <ImCancelCircle />
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium flex items-center gap-2"
                    >
                        <FaRegCircleCheck />
                        Save Changes
                    </button>
                </div>

            </div>
        </div>

    );
}

export default JoinEventModal;
