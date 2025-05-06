import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import DateTimePicker from '../../components/event-management-user-side/DateTimePicker';
import BannerImageUpload from '../../components/image-uploader/BannerImageUpload';
import { shakeErrorInputVariant } from '../../components/common-animations/ShakingErrorInputVariant';
import { motion } from 'framer-motion';
import { eventValidationSchema } from '../common-erro-handling/EventCreationErrorHandler';
import DefaultCommunityImage from "../../assets/images/user-group-default.png"
import UserLocation from '../user-dash-board/UserLocation';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import { showToast } from '../toast-notification/CustomToast';

function CreateEventForm({ selectedCommunity, onBack }) {
    const [startDate, setStartDate] = useState(null);

    const handleSubmit = async (values) => {
        console.log('Submitted values:', values);

        // Prepare FormData to send via multipart/form-data (especially for the image file)
        const formData = new FormData();

        // Append common fields
        formData.append('max_participants', values.max_participants);
        formData.append('community', selectedCommunity?.id);
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('event_type', values.eventType);
        formData.append('start_datetime', values.startDate.toISOString()); // Convert date object to ISO string
        formData.append('banner', values.banner); // File object

        if (values.eventType === 'offline') {
            formData.append('address', values.address);
           
            // Send the whole location as a JSON string
            if (values.location) {
                formData.append('location', JSON.stringify(values.location));
            }
        } else if (values.eventType === 'online') {
            formData.append('online_link', values.link);

        }

        try {
            // Send the form data to the backend using axios
            const response = await AuthenticatedAxiosInstance.post('/events/create-new-event/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // This is important to handle file uploads
                },
            });

            if (response.status === 201) {
                console.log('Event submitted successfully');
                showToast("Event submitted successfully", "success")
            } else {
                console.error('Failed to submit event');
                showToast("Failed to submit event", "error")
            }
        } catch (error) {
            console.error('An error occurred while submitting the event:', error);
            showToast("Failed to submit event", "error")
        }
    };


    return (
        <div className="max-w-full mx-auto px-4">
            <div className="text-center mb-4">
                <div className="overflow-hidden rounded-lg">
                    <div
                        className="flex items-center justify-between p-3 mb-4 border border-gray-300 hover:bg-green-600 cursor-pointer rounded-lg  hover:shadow-gray-300  hover:shadow-md bg-green-500 transition-colors duration-300"
                    >
                        {/* Back Button */}
                        <button
                            onClick={onBack}
                            className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700"
                        >
                            <div className="bg-white rounded-full p-2">
                                <IoArrowBackCircleSharp className="text-green-600 h-5 w-5" />
                            </div>
                            <span className="text-white">Back to Select Community</span>
                        </button>

                        {/* Community Info */}
                        <div className="flex items-center gap-3 mr-4">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <img
                                    src={selectedCommunity?.logo || DefaultCommunityImage}
                                    alt="Community Logo"
                                    className="h-12 w-12 rounded-full object-cover border-2 border-white"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium text-white"> {selectedCommunity?.name || "Not found"}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 text-sm">Share an amazing experience with your community</p>
            </div>

            <Formik
                initialValues={{
                    title: '',
                    description: '',
                    eventType: '',
                    max_participants: '',
                    location: {
                        place_id: "",
                        full_location: "",
                        latitude: "",
                        longitude: "",
                        location_name: "",
                        country: ""
                    },
                    address: '',
                    link: '',
                    startDate: null,
                    banner: null,
                }}
                validationSchema={eventValidationSchema}
                validateOnChange={true}
                validateOnBlur={true}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, setFieldTouched, values, errors, touched, handleChange }) => (
                    <Form className="space-y-6">
                        <div>
                            {/* Banner Image Upload */}
                            <div className="flex justify-center">
                                <BannerImageUpload
                                    onImageSelect={(file) => setFieldValue('banner', file)}
                                    purpose="eventBanner"
                                />
                            </div>
                            {errors.banner && touched.banner && (
                                <p className="text-red-500 text-center text-sm mt-2">{errors.banner}</p>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                            <motion.div variants={shakeErrorInputVariant} animate={errors.title && touched.title ? 'shake' : 'idle'}>
                                <Field
                                    name="title"
                                    className={`bg-white text-black w-full px-4 py-3 border ${errors.title && touched.title ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'} rounded-lg`}
                                    placeholder="Give your event a catchy title"
                                />
                            </motion.div>
                            <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-2" />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <motion.div variants={shakeErrorInputVariant} animate={errors.description && touched.description ? 'shake' : 'idle'}>
                                <Field
                                    as="textarea"
                                    name="description"
                                    rows="4"
                                    className={`bg-white text-black w-full px-4 py-3 border ${errors.description && touched.description ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'} rounded-lg`}
                                    placeholder="Describe what your event is about"
                                />
                            </motion.div>
                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Max Participants */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Participants
                            </label>
                            <motion.div
                                variants={shakeErrorInputVariant}
                                animate={errors.max_participants && touched.max_participants ? 'shake' : 'idle'}
                            >
                                <Field
                                    name="max_participants"
                                    type="number"
                                    min="1"
                                    className={`bg-white text-black w-full px-4 py-3 border ${errors.max_participants && touched.max_participants ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'} rounded-lg`}
                                    placeholder="Describe what your event is about"
                                />
                            </motion.div>
                            {errors.max_participants && touched.max_participants && (
                                <p className="text-red-500 text-sm mt-1">{errors.max_participants}</p>
                            )}
                        </div>


                        {/* Event Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                            <motion.div
                                variants={shakeErrorInputVariant}
                                animate={errors.eventType && touched.eventType ? 'shake' : 'idle'}
                            >
                                <Field
                                    as="select"
                                    name="eventType"
                                    className={`bg-white text-black w-full px-4 py-3 border rounded-lg 
                                    ${errors.eventType && touched.eventType ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // Reset conditional fields based on event type
                                        if (e.target.value === 'online') {
                                            // Keep the structure but clear the values
                                            setFieldValue('location', {
                                                place_id: "",
                                                full_location: "",
                                                latitude: "",
                                                longitude: "",
                                                location_name: "",
                                                country: ""
                                            });
                                            setFieldValue('address', '');
                                        } else if (e.target.value === 'offline') {
                                            setFieldValue('link', '');
                                        }
                                    }}
                                >
                                    <option value="" disabled hidden>
                                        -- Select event type --
                                    </option>
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                </Field>
                            </motion.div>
                            <ErrorMessage name="eventType" component="div" className="text-red-500 text-sm mt-2" />
                        </div>

                        {/* Conditional Fields */}
                        {values.eventType === 'offline' && (
                            <>
                                {/* Location */}
                                <div>
                                    <motion.div
                                        variants={shakeErrorInputVariant}
                                        animate={errors.location?.full_location && touched.location?.full_location ? 'shake' : 'idle'}
                                    >
                                        <UserLocation
                                            formData={values}
                                            setFormData={(updatedFormData) => {
                                                if (updatedFormData.location) {
                                                    setFieldValue("location", updatedFormData.location); // updates location object
                                                    setFieldTouched("location.full_location", true);     // tell Formik we touched this field
                                                }
                                            }}
                                            errors={errors.location?.full_location} // pass full_location error string only
                                        />
                                    </motion.div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address</label>
                                    <motion.div
                                        variants={shakeErrorInputVariant}
                                        animate={errors.address && touched.address ? 'shake' : 'idle'}
                                    >
                                        <Field
                                            name="address"
                                            className={`bg-white text-black w-full px-4 py-3 border rounded-lg 
                                            ${errors.address && touched.address ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
                                            placeholder="Full address of the venue"
                                        />
                                    </motion.div>
                                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-2" />
                                </div>
                            </>
                        )}

                        {values.eventType === 'online' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Google Meet Link</label>
                                <motion.div
                                    variants={shakeErrorInputVariant}
                                    animate={errors.link && touched.link ? 'shake' : 'idle'}
                                >
                                    <Field
                                        name="link"
                                        type="url"
                                        className={`bg-white text-black w-full px-4 py-3 border rounded-lg 
                                        ${errors.link && touched.link ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
                                        placeholder="Enter the online meeting link"
                                    />
                                </motion.div>
                                <ErrorMessage name="link" component="div" className="text-red-500 text-sm mt-2" />
                            </div>
                        )}

                        {/* Date Picker */}
                        <DateTimePicker
                            label="Start Date & Time"
                            selected={startDate}
                            onChange={(date) => {
                                setStartDate(date);
                                setFieldValue('startDate', date);
                            }}
                            error={errors.startDate}
                            touched={touched.startDate}
                            shake={true}
                        />

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-lg"
                            >
                                Create Event ,{selectedCommunity?.id}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default CreateEventForm;