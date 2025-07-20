import React, { useState, useRef } from 'react'
import { FaInfoCircle, FaGlobe, FaLock } from 'react-icons/fa';
import { IoMdAddCircle } from "react-icons/io";
import ProfileImageSelector from '../../components/user-dash-board/ProfileImageSelector';
import { CommunitySchema } from '../../components/Community/CommunitySchema';
import { showToast } from '../../components/toast-notification/CustomToast';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import { useNavigate } from 'react-router-dom';
import { showButtonLoader, hideButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';
import { useDispatch } from 'react-redux';
import SelectMembersModal from '../../components/Community/CommunityModal/SelectMembersModal';

function CreateCommunity() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState({});

    //controll community image with state 
    const [resetImage, setResetImage] = useState(false);

    //modal controller for add farmers while creating a community
    const [isModalOpen, setIsModalOpen] = useState(false);

    // state for handle every form data with handleChange 
    const initialFormData = {
        name: '',
        description: '',
        is_private: false,
        tags: [],
        communityImage: null,
        members: [],
    };

    // creating state for the initalformData
    const [formData, setFormData] = useState(initialFormData);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setErrors("");
        setFormData(initialFormData);
        setTagInput("")
        setResetImage(true);
        // Reset the flag back after a tiny delay
        setTimeout(() => setResetImage(false), 100);
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        const tagRegex = /^[A-Za-z]+$/;

        if (!trimmedTag) {
            setErrors((prev) => ({ ...prev, tags: "Tag cannot be empty" }));
            return;
        }

        if (!tagRegex.test(trimmedTag)) {
            setErrors((prev) => ({ ...prev, tags: "Tags must contain only alphabets with no spaces" }));
            return;
        }

        if (formData.tags.includes(trimmedTag)) {
            setErrors((prev) => ({ ...prev, tags: "Tag already added" }));
            return;
        }

        // Add tag and clear input
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
        setTagInput('');
        setErrors((prev) => ({ ...prev, tags: '' }));
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = formData.tags.filter(tag => tag !== tagToRemove);
        setFormData(prev => ({ ...prev, tags: updatedTags }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    // Add community image/Icon in to the state 
    const handleImageSelect = (imageFile) => {
        setFormData((prevData) => ({
            ...prevData,
            communityImage: imageFile,
        }));
    };


    // handle submit to open the modal
    // Note: handle submit is not the actual submit : is just for open modal

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await handleValidation();

        if (!isValid) {
            showToast("Some details are not correct. Please check and submit again.", "error")
            return;
        }
        // Open the modal to select members
        setIsModalOpen(true);
    };

    // Handle modal submit (selected members) Actual submission...
    const handleModalSubmit = async (selectedMembers) => {
        if (selectedMembers.length === 0) {
            showToast("Please select at least one member", "error");
            return;
        }

        // Add members to formData and submit final
        const fullFormData = {
            ...formData,
            members: selectedMembers,
        };

        //set up for the button loader 
        const buttonId = "CommunityCreation"
        dispatch(showButtonLoader(buttonId));

        // Prepare for submission
        try {
            // If sending image or file, use multipart/form-data
            const submitData = new FormData();
            submitData.append('name', fullFormData.name);
            submitData.append('description', fullFormData.description);
            submitData.append('is_private', fullFormData.is_private);
            fullFormData.tags.forEach(tag => submitData.append('tags', tag));
            fullFormData.members.forEach(id => submitData.append('members', id));

            if (fullFormData.communityImage) {
                submitData.append('communityImage', fullFormData.communityImage);
            }

            const response = await AuthenticatedAxiosInstance.post(
                '/community/create-community/',
                submitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            showToast("Community Created Successfully!", "success");
            setIsModalOpen(false);

            // Reset form after successful submission
            setFormData(initialFormData);
            setTagInput('');
            setResetImage(true);
            setTimeout(() => setResetImage(false), 100);
            // Navigate to my-communities
            setTimeout(() => {
                navigate('/user-dash-board/farmer-community/my-communities');
            }, 500);

        } catch (error) {
            // console.error("Error submitting community:", error);

            showToast(`Something went wrong, ${error?.response?.data?.name[0]}...`, "error");
        } finally {
            dispatch(hideButtonLoader(buttonId))  // Hide loader afeter process
        }
    };

    // handle the validation with Yup 
    const handleValidation = async () => {
        try {
            await CommunitySchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const formErrors = {};

            if (err.inner && Array.isArray(err.inner)) {
                err.inner.forEach((error) => {
                    formErrors[error.path] = error.message;
                });
            } else if (err.path && err.message) {
                // For single field validation error
                formErrors[err.path] = err.message;
            }
            setErrors(formErrors);
            return false;
        }
    };

    return (
        <>
            {/* Create Community Content (Hidden by default) */}
            <div className="mt-6 ">
                <h2 className="text-lg font-medium text-gray-800 mb-3 dark:text-zinc-200 ">Create Community</h2>

                <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaInfoCircle className="text-yellow-700 dark:text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                                Let's build your community, A space to connect, share, and grow together. Start by entering the details below.
                            </p>
                        </div>
                    </div>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Community logo upload icon : Used the same componet used for the profile image upload.*/}
                    <div className="flex flex-col items-center justify-center ">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-zinc-200">Upload Community Image</h2>
                        <ProfileImageSelector onImageSelect={handleImageSelect} reset={resetImage} />
                        {errors.communityImage && (<p className="text-red-500 dark:text-red-400 text-sm mt-4">{errors.communityImage}</p>)}
                    </div>

                    {/* Basic information */}
                    <div>
                        <label className="block text-gray-700 dark:text-zinc-300 font-medium mb-2">Community Name</label>
                        <input
                            id='name'
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`bg-white  text-black dark:text-zinc-100 w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 rounded-lg focus:outline-none focus:ring-2 ${errors.name ? " focus:ring-red-500" : "focus:ring-green-500"
                                } transition duration-500 ease-in-out placeholder-gray-400 dark:placeholder-zinc-500`}
                            placeholder="Enter your community name"
                        />
                        {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-zinc-300 font-medium mb-2">Description</label>
                        <textarea
                            id='description'
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 ${errors.name ? " focus:ring-red-500" : "focus:ring-green-500"
                                } transition duration-500 ease-in-out placeholder-gray-400 dark:placeholder-zinc-500`}
                            placeholder="Describe what your community is about"
                            rows="3"
                        ></textarea>
                        {errors.description && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Privacy settings */}
                    <div>
                        <label className="block text-gray-700 dark:text-zinc-300 font-medium mb-2">Privacy Settings</label>
                        <div className="grid grid-cols-2 gap-4">

                            {/* Public Option */}
                            <div
                                onClick={() => setFormData({ ...formData, is_private: false })}
                                className={`border rounded-md p-4 cursor-pointer transition-colors duration-500
                                ${formData.is_private === false
                                        ? "border-green-600 bg-green-100 dark:bg-green-900 dark:border-green-500"
                                        : "border-gray-300 dark:border-zinc-600 dark:bg-zinc-900"}`}
                            >
                                <div className="flex items-center">
                                    <FaGlobe className={`mr-2 ${formData.is_private === false ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-zinc-500"}`} />
                                    <h3 className="font-medium text-gray-800 dark:text-zinc-200">Public Community</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">Anyone can see and join this community</p>
                            </div>

                            {/* Private Option */}
                            <div
                                onClick={() => setFormData({ ...formData, is_private: true })}
                                className={`border rounded-md p-4 cursor-pointer transition 
                                ${formData.is_private === true
                                        ? "border-green-600 bg-green-100 dark:bg-green-900 dark:border-green-500"
                                        : "border-gray-300 dark:border-zinc-600 dark:bg-zinc-900"}`}
                            >
                                <div className="flex items-center">
                                    <FaLock className={`mr-2 ${formData.is_private === true ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-zinc-500"}`} />
                                    <h3 className="font-medium text-gray-800 dark:text-zinc-200">Private Community</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">Admin approval required to join</p>
                            </div>

                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-gray-700 dark:text-zinc-300 font-medium mb-2">Tags</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="flex-1 py-3 px-4 border-2 border-r-0 border-gray-300 dark:border-zinc-600 rounded-l-lg focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors duration-300 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500"
                                placeholder="Add relevant tags (e.g., organic, rice, livestock)"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-r-lg hover:bg-green-700 dark:hover:bg-green-600 transition duration-200"
                            >
                                <IoMdAddCircle className="text-xl" />
                                <span className="font-medium">Add</span>
                            </button>
                        </div>
                        {/* Tag Errors */}
                        {errors.tags && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.tags}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tags.map((tag, index) => (
                                <span onClick={() => handleRemoveTag(tag)} key={index} className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm px-3 py-1 rounded-full flex items-center cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                                    {tag}
                                    <span className='ml-2'>&times;</span>
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* Submit button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-green-600 dark:bg-green-700 text-white font-medium py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
                        >
                            Create Community
                        </button>
                    </div>
                </form>
                {/* Use the SelectMembersModal component here */}
                <SelectMembersModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleModalSubmit}
                    buttonId="CommunityCreation"
                />
            </div>
        </>
    )
}

export default CreateCommunity 