import React, { useState } from 'react'
import { FaSearch, FaGlobe, FaLock, FaChevronRight, FaCamera, FaUserPlus } from 'react-icons/fa';
import { IoMdAddCircle } from "react-icons/io";
import ProfileImageSelector from '../ProfileImageSelector';
//import Yup for front-end validation
import { CommunitySchema } from './createCommunitySupportingComponents/communitySchema';
import { showToast } from '../../toast-notification/CustomToast';
//import the modal for add user while create a community by the user  


function CreateCommunity() {
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [errors, setErrors] = useState({});
    //modal controller for add farmers while creating a community
    const [isModalOpen, setIsModalOpen] = useState(false);

    // state for handle every form data with handleChange 
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_private: false,
        tags: [],
        logo: null,
        members: [],
    })

    console.log("Current formData ::::", formData)
    console.log("Errors :::", errors)

    //======================= Function to add members from modal
    const dummyMembers = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
        { id: 4, name: "David" },
    ];

    const [selectedMembers, setSelectedMembers] = useState([]);
    const handleToggleMember = (id) => {
        setSelectedMembers(prev =>
            prev.includes(id)
                ? prev.filter(memberId => memberId !== id)
                : [...prev, id]
        );
    };

    const handleModalSubmit = () => {
        if (selectedMembers.length === 0) {
            showToast("Please select at least one member", "error");
            return;
        }

        // Add members to formData and submit final
        const fullFormData = {
            ...formData,
            members: selectedMembers,
        };

        console.log("Final Submission:", fullFormData);

        setIsModalOpen(false);
        showToast("Community Created Successfully!", "success");

        // Now you can POST `fullFormData` to your backend
    };

    //******************* modal for add user end */

    //===================  handle the validation with Yup 
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

    //********************* end of Yup based validation */

    //================== Tag section setup 
    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            const updatedTags = [...formData.tags, trimmedTag];
            setFormData(prev => ({ ...prev, tags: updatedTags }));
        }
        setTagInput("");
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = formData.tags.filter(tag => tag !== tagToRemove);
        setFormData(prev => ({ ...prev, tags: updatedTags }));
    };


    const handleKeyPress = (e) => {
        if (e.key === 'enter') {
            e.preventDefault();
            handleAddTag();
        }
    };
    //***************Tag section ends

    //============== Add community image/Icon in to the state 
    const handleImageSelect = (imageFile) => {
        setFormData((prevData) => ({
            ...prevData,
            logo: imageFile,
        }));
    };

    //*************** */ add community image section ends

    //=================== handle submit starts 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await handleValidation();
        if (!isValid) {
            showToast("Errors found. Please fix and resubmit.", "error")
            return;
        }

        // Open the modal to select members
        setIsModalOpen(true);
    };
    //**************** handle submit ends

    return (
        <>
            {/* Create Community Content (Hidden by default) */}
            <div className="mt-6 ">

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Community logo upload icon : Used the same componet used for the profile image upload.*/}
                    <div className="flex flex-col items-center justify-center ">
                        <h2 className="text-lg font-semibold mb-4">Upload Community Image</h2>
                        <ProfileImageSelector onImageSelect={handleImageSelect} />
                        {<errors className="profile"></errors> && <p className="text-red-500 text-sm mt-2">{errors.profileImage}</p>}
                    </div>

                    {/* Basic information */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Community Name</label>
                        <input
                            id='name'
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.name ? " focus:ring-red-500" : "focus:ring-green-500"
                                } transition duration-500 ease-in-out`}
                            placeholder="Enter your community name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea
                            id='description'
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.name ? " focus:ring-red-500" : "focus:ring-green-500"
                                } transition duration-500 ease-in-out`}
                            placeholder="Describe what your community is about"
                            rows="3"
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Privacy settings */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Privacy Settings</label>
                        <div className="grid grid-cols-2 gap-4">

                            {/* Public Option */}
                            <div
                                onClick={() => setFormData({ ...formData, is_private: false })}
                                className={`border rounded-md p-4 cursor-pointer transition-colors duration-500
                                ${formData.is_private === false
                                        ? "border-green-600 bg-green-100"
                                        : "border-gray-300"}`}
                            >
                                <div className="flex items-center">
                                    <FaGlobe className={`mr-2 ${formData.is_private === false ? "text-green-500" : "text-gray-400"}`} />
                                    <h3 className="font-medium">Public Community</h3>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">Anyone can see and join this community</p>
                            </div>

                            {/* Private Option */}
                            <div
                                onClick={() => setFormData({ ...formData, is_private: true })}
                                className={`border rounded-md p-4 cursor-pointer transition 
                                ${formData.is_private === true
                                        ? "border-green-600 bg-green-100"
                                        : "border-gray-300"}`}
                            >
                                <div className="flex items-center">
                                    <FaLock className={`mr-2 ${formData.is_private === true ? "text-green-500" : "text-gray-400"}`} />
                                    <h3 className="font-medium">Private Community</h3>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">Admin approval required to join</p>
                            </div>

                        </div>
                    </div>




                    {/* Tags */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Tags</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="flex-1 py-3 px-4 border-2 border-r-0 border-gray-300 rounded-l-lg focus:outline-none focus:border-green-500 transition-colors duration-300"
                                placeholder="Add relevant tags (e.g., organic, rice, livestock)"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition duration-200"
                            >
                                <IoMdAddCircle className="text-xl" />
                                <span className="font-medium">Add</span>
                            </button>
                        </div>
                        {errors.tags && <p className="text-red-500 text-sm mt-2">{errors.tags}</p>}


                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tags.map((tag, index) => (
                                <span onClick={() => handleRemoveTag(tag)} key={index} className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full flex items-center cursor-pointer">
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
                            className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            Create Community
                        </button>
                    </div>
                </form>

                {/* modal for select users while creating a community */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-xl overflow-hidden">
                            {/* Green Header */}
                            <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Select Group Members</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-white hover:bg-green-700 rounded-full p-1 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Search Input */}
                                <div className="relative mb-5">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search members..."
                                        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    // Implement search logic here
                                    />
                                </div>

                                {/* Members List */}
                                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg mb-5">
                                    <div className="p-1">
                                        {dummyMembers.map((member) => (
                                            <label
                                                key={member.id}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                                            >
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 accent-green-600 cursor-pointer"
                                                        checked={selectedMembers.includes(member.id)}
                                                        onChange={() => handleToggleMember(member.id)}
                                                    />
                                                </div>
                                                <span className="text-gray-800">{member.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer with Actions */}
                            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                                <button
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors font-medium"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium flex items-center gap-2"
                                    onClick={handleModalSubmit}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Submit Members & Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

        </>
    )
}

export default CreateCommunity
