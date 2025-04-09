import React, { useState } from 'react'
import { FaSearch, FaGlobe, FaLock, FaChevronRight, FaCamera } from 'react-icons/fa';
import { IoMdAddCircle } from "react-icons/io";
import ProfileImageSelector from '../ProfileImageSelector';



function CreateCommunity() {
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

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

    // state for handle every form data with handleChange 
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_private: false,
        tags: [],
        logo: null,
    })

    console.log("Current formData ::::", formData)


    return (
        <>
            {/* Create Community Content (Hidden by default) */}
            <div className="mt-6 ">
                <form className="space-y-6">

                    {/* Community logo upload icon : Used the same componet used for the profile image upload.*/}
                    <div className="mt-10">
                        <ProfileImageSelector onImageSelect={handleImageSelect} />
                    </div>

                    {/* Basic information */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Community Name</label>
                        <input
                            id='name'
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your community name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea
                            id='description'
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Describe what your community is about"
                            rows="3"
                        ></textarea>
                    </div>



                    {/* Privacy settings */}
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
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:border-green-500"
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
            </div>

        </>
    )
}

export default CreateCommunity
