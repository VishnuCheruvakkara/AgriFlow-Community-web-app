import React, { useState, useRef,useEffect } from "react";
import ModalSkeleton from "../Modal/ModalSkeleton";
import useModal from "../../custom-hook/useModal";
import { showToast } from "../toast-notification/CustomToast";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import defaultUserImage from "../../assets/images/user-default.png";
import { useDispatch } from "react-redux";
import { showButtonLoader, hideButtonLoader } from "../../redux/slices/LoaderSpinnerSlice";
import { FaEdit } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

const EditProfilePictureModal = ({ currentImage, userId, onSuccess }) => {
    const { isOpen, openModal, closeModal } = useModal();
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        if (!isOpen) {
            setSelectedImage(null); // Reset selected image when modal is closed
        }
    }, [isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast("Only image files are allowed", "error");
            return;
        }

        setSelectedImage(file);
    };

    const handleUpdate = async () => {
        if (!selectedImage) {
            showToast("Please select a new profile image.", "error");
            return;
        }

        dispatch(showButtonLoader("updateProfilePicture"));
        try {
            const formData = new FormData();
            formData.append("profile_picture", selectedImage);

            await AuthenticatedAxiosInstance.patch(`/users/update-profile-picture/`, formData);
            showToast("Profile picture updated!", "success");
            closeModal();
            onSuccess?.();
        } catch (error) {
            console.error(error);
            showToast("Failed to update profile picture", "error");
        } finally {
            dispatch(hideButtonLoader("updateProfilePicture"));
        }
    };

    return (
        <>
            <div
                onClick={openModal}
                className="absolute dark:hover:bg-zinc-700 cursor-pointer top-[15px] md:left-[135px] left-[120px] p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md "
            >
                <FaEdit className="text-green-700 dark:text-green-400 " />
            </div>

            <ModalSkeleton
                isOpen={isOpen}
                onClose={closeModal}
                title="Edit Profile Picture"
                onSubmit={handleUpdate}
                isSubmitDisabled={!selectedImage}
                submitButtonText="Update"
                submitButtonId="updateProfilePicture"
                width="w-[550px]"
                height="h-[550px]"
            >
                <div className="flex flex-col items-center p-4 space-y-6 overflow-hidden">

                    <span className="border-2 p-1 mt-6 rounded-full border-dashed border-green-500">

                        <img
                            src={
                                selectedImage
                                    ? URL.createObjectURL(selectedImage)
                                    : currentImage || defaultUserImage
                            }
                            alt="Current"
                            className="w-60 h-60  rounded-full object-cover border border-zinc-500"
                        />
                    </span>
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
                        <span className="text-sm pr-10 pl-4">Choose New Image</span>
                    </button>
                </div>
            </ModalSkeleton>
        </>
    );
};

export default EditProfilePictureModal;
