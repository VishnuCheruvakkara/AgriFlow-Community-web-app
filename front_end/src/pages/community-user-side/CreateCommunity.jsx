import React, { useState, useEffect, useRef } from 'react'
import { FaSearch, FaGlobe, FaLock, FaChevronRight, FaCamera, FaUserPlus,FaInfoCircle} from 'react-icons/fa';
import { IoMdAddCircle } from "react-icons/io";
import { AiOutlineCheck } from 'react-icons/ai';
import { FaRegCircleCheck } from "react-icons/fa6";
import { ImCancelCircle } from "react-icons/im";
// improt loader spinner  
import { PulseLoader } from 'react-spinners';
// improt sweet alert here 
import { showConfirmationAlert } from '../../components/SweetAlert/showConfirmationAlert';
//import image selector for community image upload 
import ProfileImageSelector from '../../components/user-dash-board/ProfileImageSelector';
//import Yup for front-end validation
import { CommunitySchema } from '../../components/Community/CommunitySchema';
import { showToast } from '../../components/toast-notification/CustomToast';
//import the dummy image for the users 
import DefaultUserImage from "../../assets/images/user-default.png"
//import the axios instace for send request to the end point 
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
//import for navigate after success full community creation
import { useNavigate } from 'react-router-dom';
//implementaion of the loader while submit data in a form 
import ButtonLoader from '../../components/LoaderSpinner/ButtonLoader';
import { showButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';
import { useDispatch } from 'react-redux';

function CreateCommunity() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    //debouncer state setup
    const debounceTimeout = useRef(null);
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState({});
    //set members get from backend to here : for select the community members.
    const [members, setMembers] = useState([]);
    //loader state 
    const [loading, setLoading] = useState(false);
    //state for infinite scroll : show users data while creating community (Display in the modal)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    //for search the members showed in the modal 
    const [searchQuery, setSearchQuery] = useState("");
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

    console.log("Current formData ::::", formData)
    console.log("Errors :::", errors)

    //======================= Function const handleCloseModal = (shouldClearSearch = true) => {
    const handleCloseModal = async (shouldClearSearch = true) => {
        const result = await showConfirmationAlert({
            title: 'Cancel Community creation ?',
            text: 'Are you sure you want to Cancell the community creation ?',
            confirmButtonText: 'Yes, Cancell it',
            cancelButtonText: 'No, Keep it',
        });

        if (result) {
            setIsModalOpen(false);
            setSearchQuery(''); // Clear search query when closing the modal
            setErrors("");
            setSelectedMembers([]);
            setFormData(initialFormData);
            setTagInput("")
            setResetImage(true);
            // Reset the flag back after a tiny delay
            setTimeout(() => setResetImage(false), 100);
        }
    };

    //======================= Function to add members from modal

    const [selectedMembers, setSelectedMembers] = useState([]);
    const handleToggleMember = (id) => {
        setSelectedMembers(prev =>
            prev.includes(id)
                ? prev.filter(memberId => memberId !== id)
                : [...prev, id]
        );
    };
    console.log("selected members ::::", selectedMembers)

    const handleModalSubmit = async () => {
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
            // Debugger for the sumbitData
            for (let [key, value] of submitData.entries()) {
                console.log(`${key}:`, value);
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
            setSelectedMembers([]);
            setResetImage(true);
            setTimeout(() => setResetImage(false), 100);
            // Navigate to my-communities
            setTimeout(() => {
                navigate('/user-dash-board/farmer-community/my-communities');
            }, 500); 

        } catch (error) {
            console.error("Error submitting community:", error);
            showToast("Something went wrong while creating community", "error");
        } finally {
            dispatch(hideButtonLoader(buttonId))  // Hide loader afeter process
        }
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

    //***************Tag section ends

    //============== Add community image/Icon in to the state 
    const handleImageSelect = (imageFile) => {
        setFormData((prevData) => ({
            ...prevData,
            communityImage: imageFile,
        }));
    };

    //*************** */ add community image section ends

    //=================== set up for the fetch memebers while open modal and  handle submit to open the modal
    //Note: handle submit is not the actual submit : is just for open modal

    const fetchMembers = async (pageNum = 1, query = searchQuery) => {
        try {
            setLoading(true);
            const response = await AuthenticatedAxiosInstance.get(`/community/get-users-create-community/?page=${pageNum}&search=${query}`);
            const newMembers = response.data.results;
            console.log("New memeber : ", newMembers)

            if (pageNum === 1) {
                setMembers(newMembers); // first page: reset list
            } else {
                setMembers((prev) => [...prev, ...newMembers]); // append next pages
            }

            setHasMore(response.data.next !== null); // check if more pages exist
        } catch (error) {
            console.error("Error fetching members:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    //debounce set up for prevent the direct search entry 
    useEffect(() => {
      
    
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
    
        // Set a new debounce timer
        debounceTimeout.current = setTimeout(() => {
            setPage(1); // Reset to page 1 on new search
            fetchMembers(1, searchQuery); // Fetch using current search query
        }, 500); // 500ms debounce delay
    
        return () => {
            clearTimeout(debounceTimeout.current); // Cleanup on unmount or change
        };
    }, [searchQuery]); 


    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await handleValidation();

        if (!isValid) {
            showToast("Some details are not correct. Please check and submit again.", "error")
            return;
        }

        // Open the modal to select members
        setPage(1);
        setIsModalOpen(true);
        fetchMembers(1); // Load the first page of users
    };

    //**************** handle submit ends

    return (
        <>
            {/* Create Community Content (Hidden by default) */}
            <div className="mt-6 ">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                <FaInfoCircle className="text-yellow-700" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                    Let’s build your community, A space to connect, share, and grow together. Start by entering the details below.
                                    </p>
                                </div>
                            </div>
                        </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Community logo upload icon : Used the same componet used for the profile image upload.*/}
                    <div className="flex flex-col items-center justify-center ">
                        <h2 className="text-lg font-semibold mb-4">Upload Community Image</h2>
                        <ProfileImageSelector onImageSelect={handleImageSelect} reset={resetImage} />
                        {errors.communityImage && (<p className="text-red-500 text-sm mt-4">{errors.communityImage}</p>)}
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
                        {/* Tag Errors */}
                        {errors.tags && (
                            <p className="text-red-500 text-sm mt-2">{errors.tags}</p>
                        )}


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
                        <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md overflow-hidden">
                            {/* Green Header */}
                            <div className="bg-gradient-to-r from-green-700 to-green-400  px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Select Group Members</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-white hover:bg-green-700 rounded-full p-1 transition-colors duration-300"
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

                                    <div className="relative w-full">
                                        {/* Search Icon on the left */}
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />

                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by name or location..."
                                            className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 outline-none transition-colors duration-300"
                                        />

                                        {/* Clear button on the right */}
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-300"
                                            >
                                                <ImCancelCircle size={20} />
                                            </button>
                                        )}
                                    </div>

                                </div>

                                {/* Members List */}
                                {/* Select All */}

                                {loading ? (
                                    <div className="flex flex-col justify-center items-center py-28">
                                        <PulseLoader color="#16a34a" speedMultiplier={1} />
                                        <p className="mt-4 text-sm text-gray-500">Loading farmers, please wait...</p>
                                    </div>
                                ) : (

                                    <div>

                                        {members.length === 0 ? (
                                            <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-10 px-4 bg-gray-100 rounded-md">
                                                <p className="text-lg font-semibold ">No farmers found!</p>
                                                <p className="text-xs text-gray-500">Try using a different search keyword.</p>
                                            </div>

                                        ) : (
                                            <>
                                                <div className="flex justify-between items-center mb-3 px-3">


                                                    <label htmlFor="select-all" className="relative flex items-center gap-2 cursor-pointer p-1">
                                                        <input
                                                            id="select-all"
                                                            type="checkbox"
                                                            checked={members.length === selectedMembers.length}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedMembers(members.map((m) => m.id));
                                                                } else {
                                                                    setSelectedMembers([]);
                                                                }
                                                            }}
                                                            className="peer relative h-5 w-5 appearance-none rounded-full border border-green-600 shadow-sm transition-all
               before:absolute before:top-1/2 before:left-1/2 before:h-12 before:w-12 before:-translate-y-1/2 before:-translate-x-1/2 
               before:rounded-full before:bg-green-400 before:opacity-0 before:transition-opacity 
               checked:border-green-600 checked:bg-green-600 checked:before:bg-green-400 hover:before:opacity-10"
                                                        />

                                                        {/* React Icon inside checkbox */}
                                                        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                            <AiOutlineCheck className="font-bold text-xs" />
                                                        </span>

                                                        <span className="text-sm font-medium text-gray-700 pl-1">Select All</span>
                                                    </label>


                                                </div>

                                                {/* Member List */}
                                                <div
                                                    className="max-h-60 overflow-y-auto border-2 border-gray-300 rounded-lg mb-3 scrollbar-hide"
                                                    onScroll={(e) => {
                                                        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                                                        if (scrollHeight - scrollTop <= clientHeight + 1 && hasMore && !loading) {
                                                            const nextPage = page + 1;
                                                            setPage(nextPage);
                                                            fetchMembers(nextPage); // fetchMembers will use current searchQuery
                                                        }
                                                    }}
                                                >
                                                    <div className="p-1">
                                                        {members.map((member) => (
                                                            <label
                                                                key={member.id}
                                                                className="mb-2 flex items-center justify-between gap-3 px-2 py-2 m-1 hover:bg-green-100 rounded-md cursor-pointer transition duration-500 ease-in-out"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <img
                                                                        src={member.profile_picture || DefaultUserImage}
                                                                        alt="farmers"
                                                                        className="w-10 h-10 rounded-full object-cover"
                                                                    />

                                                                    {/* Wrap text in a vertical flex container */}
                                                                    <div className="flex flex-col">
                                                                        <span className="text-gray-800 font-medium">
                                                                            {member.username}
                                                                        </span>
                                                                        <p className="text-xs text-gray-500">
                                                                            {`${member.location.location_name}-${member.location.country}` || "No location"} {/* Optional fallback */}
                                                                        </p>
                                                                    </div>
                                                                </div>


                                                                <div className="relative mr-3 mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedMembers.includes(member.id)}
                                                                        onChange={() => handleToggleMember(member.id)}
                                                                        className="peer appearance-none h-5 w-5 rounded-full border border-green-600 bg-white
              checked:bg-green-600 checked:border-green-600 cursor-pointer transition relative"
                                                                    />
                                                                    <span className="pointer-events-none absolute top-[10px] left-1/2 -translate-x-1/2 -translate-y-1/2 
            text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                                        <AiOutlineCheck className="text-xs" />
                                                                    </span>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>


                                                {/* Selected Count */}
                                                <div className="text-right text-sm text-gray-600 px-3">
                                                    {selectedMembers.length} selected
                                                </div>
                                            </>
                                        )}

                                    </div>
                                )}

                            </div>

                            {/* Footer with Actions */}
                            <div className="bg-gray-100 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                                <button
                                    className="px-4 py-3 bg-gray-400 hover:bg-gray-500 text-gray-800 rounded-md transition-colors font-medium flex items-center gap-2"
                                    onClick={handleCloseModal}
                                ><ImCancelCircle />
                                    Cancel
                                </button>
                                <ButtonLoader
                                    buttonId="CommunityCreation"
                                    className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium flex items-center gap-2"
                                    onClick={handleModalSubmit}
                                >
                                    <FaRegCircleCheck />
                                    Submit Members & Create
                                </ButtonLoader>
                            </div>
                        </div>
                    </div>
                )}

            </div>

        </>
    )
}

export default CreateCommunity
