import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegCircleCheck } from "react-icons/fa6";
import { ImCancelCircle } from "react-icons/im";
import ProfileImageSelector from '../../user-dash-board/ProfileImageSelector';
import * as Yup from 'yup'; 
import { Formik, Field, Form, ErrorMessage } from 'formik'; 
import { FaInfoCircle } from 'react-icons/fa';
import { showToast } from '../../toast-notification/CustomToast';
import AuthenticatedAxiosInstance from '../../../axios-center/AuthenticatedAxiosInstance';
import { showConfirmationAlert } from '../../SweetAlert/showConfirmationAlert';
import { PulseLoader } from 'react-spinners';
import { shakeErrorInputVariant } from '../../common-animations/ShakingErrorInputVariant';

const validationSchema = Yup.object({
    name: Yup.string()
        .matches(/^[a-zA-Z0-9\s]+$/, 'Name must contain only letters and numbers')
        .max(25, 'Name must not exceed 25 characters')
        .required('Community name is required'),

    description: Yup.string()
        .min(20, 'Description must be at least 20 characters long')
        .max(300, 'Description must not exceed 300 characters')
        .matches(/^[^<>]*$/, 'Special tags are not allowed')
        .required('Please enter a description'),

});

const EditCommunityModal = ({ isOpen, onClose, community, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    //controll community image with state , set the default image on the first page load 
    const [resetImage, setResetImage] = useState(false);
    const [communityImage, setCommunityImage] = useState(null); // image file
    const [initialImageUrl, setInitialImageUrl] = useState(''); // image URL
    //local loading set up 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (community) {
            setName(community.name || '');
            setDescription(community.description || '');
            setInitialImageUrl(community.image || '');
            setCommunityImage(null); // reset file on modal open
        }
    }, [community]);

    const handleSave = async (values) => {
        const formData = new FormData();
        let hasChanges = false;

        if (values.name !== community.name) {
            formData.append('name', values.name);
            hasChanges = true;
        }

        if (values.description !== community.description) {
            formData.append('description', values.description);
            hasChanges = true;
        }

        if (communityImage && communityImage.name !== community.community_logo) {
            formData.append('image', communityImage);
            hasChanges = true;
        }

        if (!hasChanges) {
            showToast("No changes made.", "info");
            onClose();
            return;
        }

        const result = await showConfirmationAlert({
            title: 'Edit Community?',
            text: `Are you sure you want to save changes for the community "${community.name}"?`,
            confirmButtonText: 'Yes, Save Changes',
            cancelButtonText: 'No, Cancel',
        });

        if (result) {
            setLoading(true); // Start loader
            try {
                const response = await AuthenticatedAxiosInstance.patch(
                    `/community/edit-community-details/${community?.id}/`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                showToast("Community updated successfully!", "success");

                const updatedFields = {};
                if (formData.has('name')) updatedFields.name = values.name;
                if (formData.has('description')) updatedFields.description = values.description;
                if (formData.has('image')) updatedFields.image = URL.createObjectURL(communityImage);

                onSave(updatedFields);
                onClose();
            } catch (error) {
                // console.error("Error updating community:", error);
                showToast("Something went wrong while updating the community", "error");
            } finally {
                setLoading(false); // Stop loader
            }
        }
    };

    // Add community image/Icon in to the state 
    const handleImageSelect = (imageFile) => {
        setCommunityImage(imageFile);
    };

    // add community image section ends

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed  inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">

                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 180, damping: 18 } }}
                    exit={{ opacity: 0, scale: 0.85, y: 40, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-[90%] max-w-md overflow-hidden "
                >
                    {/* Loader overlay INSIDE modal */}
                    {loading && (
                        <div className="absolute inset-0 bg-white dark:bg-zinc-800 bg-opacity-80 dark:bg-opacity-80 z-20 flex justify-center items-center">
                            <div className="flex flex-col items-center">
                                <PulseLoader color="#16a34a" size={12} />
                                <p className="mt-4 text-black dark:text-zinc-200 font-medium">Updating community...</p>
                            </div>
                        </div>
                    )}
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-green-700 to-green-400 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-white font-semibold text-lg">Edit Community</h2>

                        <button
                            onClick={onClose}
                            className="text-white hover:bg-green-700 rounded-full p-1 transition-colors duration-300"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="px-6 py-5 max-h-[60vh] w-full overflow-y-auto no-scrollbar">

                        {/* community image  */}
                        {/* Community logo upload icon : Used the same componet used for the profile image upload.*/}
                        <div className="flex flex-col items-center justify-center mb-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-zinc-100">Edit Community Image</h2>
                            <div className="w-full bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <FaInfoCircle className="text-yellow-700 dark:text-yellow-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                            Click image to select a new one
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <ProfileImageSelector
                                onImageSelect={handleImageSelect}
                                reset={false} // if you don't want it to auto-reset
                                initialImage={initialImageUrl}
                            />
                        </div>

                        <Formik
                            initialValues={{
                                name: community?.name || '',
                                description: community?.description || '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSave}
                        >
                            {({ values, handleChange, handleBlur, errors, touched }) => (
                                <Form id="edit-community-form">
                                    <div className="mb-4">
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-zinc-300">Name</label>
                                        <motion.div variants={shakeErrorInputVariant} animate={errors.name && touched.name ? 'shake' : ''}>
                                            <Field
                                                type="text"
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-3 border-2 mb-2 dark:bg-zinc-700 dark:text-zinc-100 ${errors.name && touched.name
                                                    ? 'border-red-500'
                                                    : 'border-gray-300 dark:border-zinc-600 focus:border-green-500'
                                                    } rounded-lg  outline-none transition-colors duration-300`}
                                            />
                                        </motion.div>
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-zinc-300">Description</label>
                                        <motion.div variants={shakeErrorInputVariant} animate={errors.description && touched.description ? 'shake' : ''}>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-3 py-3 border-2 dark:bg-zinc-700 dark:text-zinc-100 ${errors.description && touched.description
                                                    ? 'border-red-500'
                                                    : 'border-gray-300 dark:border-zinc-600 focus:border-green-500'
                                                    } rounded-lg  outline-none transition-colors duration-300`}
                                            />
                                        </motion.div>
                                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                                    </div>

                                </Form>
                            )}
                        </Formik>

                    </div>
                    {/* Modal Footer */}
                    <div className="bg-gray-100 dark:bg-zinc-700 px-6 py-2 flex justify-end gap-3 border-t border-gray-200 dark:border-zinc-600">
                        <button
                            className="px-4 py-3 bg-gray-400 dark:bg-zinc-500 hover:bg-gray-500 dark:hover:bg-zinc-600 text-gray-800 dark:text-zinc-300 rounded-md transition-colors font-medium flex items-center gap-2"
                            onClick={onClose}
                        >
                            <ImCancelCircle />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="edit-community-form"
                            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium flex items-center gap-2"
                        >
                            <FaRegCircleCheck />
                            Save
                        </button>
                    </div>
                    
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditCommunityModal;
