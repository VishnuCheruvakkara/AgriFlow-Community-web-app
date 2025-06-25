import React, { useState } from "react";
import { MdPostAdd } from "react-icons/md";
import ModalSkeleton from "../Modal/ModalSkeleton";
import PostCreationModalContent from "./PostCreationModalContent";
import useModal from "../../custom-hook/useModal";
import defaultUserImage from "../../assets/images/user-default.png";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import { showToast } from "../toast-notification/CustomToast";
import { useDispatch } from "react-redux";
import { showButtonLoader, hideButtonLoader } from "../../redux/slices/LoaderSpinnerSlice";

function PostCreationModalButton({ user }) {
    const { isOpen, openModal, closeModal } = useModal();

    const [postText, setPostText] = useState("");
    const [mediaFile, setMediaFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null); 

    const dispatch = useDispatch();

    console.log("DATA for post creation :::", postText, mediaFile)

    const handleAddPost = async () => {
        if (!postText.trim() && !mediaFile) {
            showToast("Create a post to share.", "error");
            return;
        }

        const buttonId = "postConfirmationButton";
        dispatch(showButtonLoader(buttonId));

        try {
            const formData = new FormData();
            formData.append("content", postText);
            if (mediaFile) {
                formData.append("media", mediaFile);
            }

            await AuthenticatedAxiosInstance.post("/posts/create-new-post/", formData);
            showToast("Post created successfully!", "success");

            // Reset form after successfull creation 
            setPostText("");
            setMediaFile(null);
            setPreviewURL(null); 
            closeModal();
        } catch (error) {
            console.error(error);
            showToast("Failed to create post", "error");
        } finally {
            dispatch(hideButtonLoader(buttonId));
        }
    };

    return (
        <>
            <div
                onClick={openModal}
                className="cursor-pointer flex items-center justify-between bg-gradient-to-r from-green-700 to-green-400 p-2 rounded-full"
            >
                <div className="h-10 w-10 border rounded-full bg-gray-200 overflow-hidden">
                    <img
                        src={user?.profile_picture || defaultUserImage}
                        alt="User"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="text-white text-md font-bold">Create New Post</div>
                <button className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                    <MdPostAdd className="text-2xl" />
                </button>
            </div>

            <ModalSkeleton
                isOpen={isOpen}
                onClose={closeModal}
                title="Create Post"
                onSubmit={handleAddPost}
                isSubmitDisabled={!postText.trim() && !mediaFile}
                submitButtonText="Create Post"
                submitButtonId="postConfirmationButton"

            >
                <PostCreationModalContent
                    postText={postText}
                    setPostText={setPostText}
                    mediaFile={mediaFile}
                    setMediaFile={setMediaFile}
                    previewURL={previewURL}
                    setPreviewURL={setPreviewURL}
                />
            </ModalSkeleton>
        </>
    );
}

export default PostCreationModalButton;
