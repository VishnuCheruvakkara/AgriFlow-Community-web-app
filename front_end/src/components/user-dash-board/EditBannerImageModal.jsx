import React, { useState, useRef, useEffect } from "react";
import ModalSkeleton from "../Modal/ModalSkeleton";
import useModal from "../../custom-hook/useModal";
import { showToast } from "../toast-notification/CustomToast";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import { useDispatch } from "react-redux";
import { showButtonLoader, hideButtonLoader } from "../../redux/slices/LoaderSpinnerSlice";
import { FaRegEdit } from "react-icons/fa";
import defaultBannerImage from "../../assets/images/banner_default_user_profile.png";
import { FaEdit } from "react-icons/fa";

const EditBannerImageModal = ({ currentBanner, onSuccess }) => {
    const { isOpen, openModal, closeModal } = useModal();
    const dispatch = useDispatch();
    const [selectedBanner, setSelectedBanner] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        if (!isOpen) setSelectedBanner(null);
    }, [isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast("Only image files are allowed", "error");
            return;
        }

        // Size check: 5 MB max
        const maxSize = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxSize) {
            showToast("Image size exceeds 5 MB limit.", "error");
            e.target.value = null;
            return;
        }

        setSelectedBanner(file);
    };

    const handleUpdate = async () => {
        if (!selectedBanner) {
            showToast("Please select a new banner image.", "error");
            return;
        }

        dispatch(showButtonLoader("updateBannerImage"));
        try {
            const formData = new FormData();
            formData.append("banner_image", selectedBanner);

            await AuthenticatedAxiosInstance.patch(`/users/update-banner-image/`, formData);
            showToast("Banner image updated!", "success");
            closeModal();
            onSuccess?.();
        } catch (error) {
            console.error(error);
            showToast("Failed to update banner image", "error");
        } finally {
            dispatch(hideButtonLoader("updateBannerImage"));
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="absolute bottom-4 right-4  bg-white dark:bg-zinc-800 text-green-700 dark:text-green-400 p-2 rounded-full shadow-md hover:bg-green-50 dark:hover:bg-zinc-700"
            >
                <FaEdit className="text-xl" />
            </button>

            <ModalSkeleton
                isOpen={isOpen}
                onClose={closeModal}
                title="Edit Banner Image"
                onSubmit={handleUpdate}
                isSubmitDisabled={!selectedBanner}
                submitButtonText="Update"
                submitButtonId="updateBannerImage"
                width="w-[800px]"
                height="h-[500px]"
            >
                <div className="flex flex-col items-center p-4 space-y-6 overflow-hidden mt-7">
                    <img
                        src={
                            selectedBanner
                                ? URL.createObjectURL(selectedBanner)
                                : currentBanner || defaultBannerImage
                        }
                        alt="Banner"
                        className="w-full h-48 object-cover rounded shadow border"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-green-500 mt-5 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg dark:bg-green-600 dark:hover:bg-green-700"
                    >
                        <div className="bg-white rounded-full p-2 dark:bg-zinc-100">
                            <FaRegEdit className="text-green-500" />
                        </div>
                        <span className="text-sm pr-10 pl-4">Choose New Banner</span>
                    </button>
                </div>
            </ModalSkeleton>
        </>
    );
};

export default EditBannerImageModal;
