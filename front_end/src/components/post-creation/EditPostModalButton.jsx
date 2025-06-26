import React, { useState, useEffect } from "react";
import ModalSkeleton from "../Modal/ModalSkeleton";
import PostCreationModalContent from "./PostCreationModalContent";
import { FaEdit } from "react-icons/fa";
import useModal from "../../custom-hook/useModal";
import { showToast } from "../toast-notification/CustomToast";
import { useDispatch } from "react-redux";
import { showButtonLoader, hideButtonLoader } from "../../redux/slices/LoaderSpinnerSlice";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";

const EditPostModalButton = ({ post, onSuccess }) => {
    const { isOpen, openModal, closeModal } = useModal();
    const dispatch = useDispatch();

    const [postText, setPostText] = useState("");
    const [mediaFile, setMediaFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    // Reset modal state every time modal opens
    useEffect(() => {
        if (isOpen) {
            setPostText(post.content || "");
            setMediaFile(null);
            setPreviewURL(post.image_url || post.video_url || null);
        }
    }, [isOpen]);

    const handleUpdatePost = async () => {
        if (!postText.trim() && !mediaFile && !previewURL) {
            showToast("Post content or media is required.", "error");
            return;
        }

        const buttonId = "postUpdateButton";
        dispatch(showButtonLoader(buttonId));

        try {
            const formData = new FormData();
            if (postText.trim()) formData.append("content", postText);

            if (mediaFile) {
                formData.append("media", mediaFile); // new file uploaded
            } else if (!previewURL) {
                formData.append("remove_media", "true"); // user removed media
            }

            await AuthenticatedAxiosInstance.patch(`/posts/edit-post/${post.id}/`, formData);
            showToast("Post updated successfully!", "success");
            closeModal();
            onSuccess?.(); // Refresh post list
        } catch (error) {
            console.error(error);
            showToast(error?.response?.data?.[0] || "Something went wrong", "error");

        } finally {
            dispatch(hideButtonLoader(buttonId));
        }
    };

    return (
        <>
            <button
                className="p-2 rounded-full border border-green-500 hover:bg-green-100 dark:hover:bg-green-900 transition tooltip tooltip-top"
                data-tip="Edit"
                onClick={openModal}
                title="Edit Post"
            >
                <FaEdit className="text-green-600 dark:text-green-400" size={18} />
            </button>

            <ModalSkeleton
                isOpen={isOpen}
                onClose={closeModal}
                title="Edit Post"
                onSubmit={handleUpdatePost}
                isSubmitDisabled={!postText.trim() && !mediaFile && !previewURL}
                submitButtonText="Update"
                submitButtonId="postUpdateButton"
                width="w-[1000px]"
                height="h-[670px]"

            >
                <PostCreationModalContent
                    postText={postText}
                    setPostText={setPostText}
                    mediaFile={mediaFile}
                    setMediaFile={setMediaFile}
                    previewURL={previewURL}
                    setPreviewURL={setPreviewURL} // Allow modal to update preview
                    existingMediaUrl={post.image_url || post.video_url}
                />
            </ModalSkeleton>
        </>
    );
};

export default EditPostModalButton;
