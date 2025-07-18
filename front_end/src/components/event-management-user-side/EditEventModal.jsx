import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { FaInfoCircle } from 'react-icons/fa';
import { PulseLoader } from 'react-spinners';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import BannerImageUpload from '../image-uploader/BannerImageUpload';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { ImCancelCircle } from 'react-icons/im';
import { eventValidationSchema } from '../common-erro-handling/EventCreationErrorHandler';
import { shakeErrorInputVariant } from '../common-animations/ShakingErrorInputVariant';
import DateTimePicker from './DateTimePicker';
import { showToast } from '../toast-notification/CustomToast';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';

const EditEventModal = ({ isOpen, onClose, eventData, onSave }) => {
    console.log("Event data while click ::::: ", eventData)
    if (!isOpen || !eventData) return null;

    const initialValues = {
        title: eventData.title || '',
        description: eventData.description || '',
        max_participants: eventData.max_participants || '',
        eventType: eventData.event_type || '',
        startDate: eventData.start_datetime ? new Date(eventData.start_datetime) : null,
        banner: eventData.banner_url || null,

        address: eventData.address || '',


    };

    const onSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('max_participants', values.max_participants);
            formData.append('start_datetime', values.startDate.toISOString());
            formData.append('address', values.address);
            formData.append('event_type', eventData.event_type);

            if (values.banner instanceof File) {
                formData.append('banner', values.banner);
            }

            // DEBUG: Print all FormData entries
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            const response = await AuthenticatedAxiosInstance.patch(`/events/edit-event/${eventData.id}/`, formData);
            console.log('Event updated 234234234:', response.data);
            onSave({
                ...eventData,
                ...values,
                banner_url: typeof values.banner === 'string'
                    ? values.banner
                    : URL.createObjectURL(values.banner), // Show preview if a file is selected
                start_datetime: values.startDate.toISOString(),
            });

            onClose();
            showToast("Event updated successfully", "success")
        } catch (error) {
            console.error('Error updating event:', error);
            if (error.response?.status === 400 && error.response.data) {
                setErrors(error.response.data);
            }

            showToast("Error updating event", "error")
        } finally {
            setSubmitting(false);
        }
    };


    return (


        <div className="fixed inset-0 z-[9999]">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-90" onClick={onClose} />

            {/* Modal content */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.85, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="bg-white dark:bg-zinc-800 w-full max-w-2xl rounded-lg shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-700 to-green-400 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Edit Event</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-green-600 rounded-full p-1"
                            aria-label="Close modal"
                        >
                            <AiOutlineClose size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={eventValidationSchema}
                            enableReinitialize
                            onSubmit={onSubmit}
                        >
                            {({ isSubmitting, setFieldValue, values, handleSubmit, errors, touched }) => (
                                <Form id="edit-event-form" className="space-y-6 px-12 mb-6">
                                    {/* Banner Upload */}
                                    <div className="flex justify-center">
                                        <BannerImageUpload
                                            onImageSelect={(file) => setFieldValue('banner', file)}
                                            purpose="eventBanner"
                                            defaultImage={eventData?.banner_url}
                                        />
                                    </div>
                                    <ErrorMessage name="banner" component="div" className="text-red-500 text-sm text-center" />

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2 dark:text-white">Event title</label>
                                        <motion.div
                                            variants={shakeErrorInputVariant}
                                            animate={errors.title && touched.title ? 'shake' : ''}>
                                            <Field
                                                name="title"
                                                className={`bg-white dark:bg-zinc-900 dark:text-white w-full px-4 mb-1 py-3 border 
                                            ${errors.title && touched.title ? 'ring-2 ring-red-500 border-none' : ' dark:border-zinc-600 focus:ring-2 focus:ring-green-500'} 
                                            rounded-lg transition duration-500 ease-out`}
                                                placeholder="Event Title"
                                            />
                                        </motion.div>
                                        <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2 dark:text-white">Description</label>
                                        <motion.div
                                            variants={shakeErrorInputVariant}
                                            animate={errors.description && touched.description ? 'shake' : ''}>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                rows="4"
                                                className={`bg-white dark:bg-zinc-900 dark:text-white w-full px-4 py-3 border 
                                            ${errors.description && touched.description ? 'ring-2 ring-red-500 border-none' : ' dark:border-zinc-600 focus:ring-2 focus:ring-green-500'} 
                                            rounded-lg transition duration-500 ease-out`}
                                                placeholder="Event Description"
                                            />
                                        </motion.div>
                                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    {/* Max Participants */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2 dark:text-white">Max Participants</label>
                                        <motion.div
                                            variants={shakeErrorInputVariant}
                                            animate={errors.max_participants && touched.max_participants ? 'shake' : ''}>
                                            <Field
                                                name="max_participants"
                                                type="number"
                                                className={`bg-white dark:bg-zinc-900 dark:text-white w-full px-4 mb-1 py-3 border 
                                            ${errors.max_participants && touched.max_participants ? 'ring-2 ring-red-500 border-none' : ' dark:border-zinc-600 focus:ring-2 focus:ring-green-500'} 
                                            rounded-lg transition duration-500 ease-out`}
                                                placeholder="Enter a positive number "
                                            />
                                        </motion.div>
                                        <ErrorMessage name="max_participants" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    {/* Alert Box */}
                                    <div className="bg-red-100 border-l-4 border-red-400 p-4 mb-6 shadow-sm dark:bg-red-950 dark:border-red-600">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <FaInfoCircle className="text-red-700 dark:text-red-400" />
                                            </div>
                                            <div className="ml-3 space-y-2">
                                                <p className="text-sm text-red-800 dark:text-red-300">
                                                    You can't change the event type, but you can edit the{' '}
                                                    {eventData.event_type === 'offline' ? 'address' : 'online details'}.
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Event Type Display */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2 dark:text-white ">Event Type</label>
                                        <div className="bg-gray-100 dark:bg-zinc-600 text-gray-500 dark:text-gray-300 w-full px-4 mb-1 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg cursor-not-allowed opacity-75">
                                            {eventData.event_type === 'online' ? 'Online' : 'Offline'}
                                        </div>
                                    </div>

                                    {/* Address */}
                                    {eventData.event_type === 'offline' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2 dark:text-white">Event Address</label>
                                            <motion.div
                                                variants={shakeErrorInputVariant}
                                                animate={errors.address && touched.address ? 'shake' : ''}>
                                                <Field
                                                    name="address"
                                                    className={`bg-white dark:bg-zinc-900 dark:text-white w-full px-4 mb-1 py-3 border 
                                                ${errors.address && touched.address ? 'ring-2 ring-red-500 border-none' : ' dark:border-zinc-600 focus:ring-2 focus:ring-green-500'} 
                                                rounded-lg transition duration-500 ease-out`}
                                                    placeholder="Enter the event address"
                                                />
                                            </motion.div>
                                            <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    )}

                                    {/* Start Date */}
                                    <DateTimePicker
                                        label="Start Date"
                                        selected={values.startDate}
                                        onChange={(date) => setFieldValue('startDate', date)}
                                        required={true}
                                        error={errors.startDate}
                                        touched={touched.startDate}
                                        shake={true}
                                    />
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Footer Buttons */}
                    <div className="bg-gray-100 dark:bg-zinc-700 px-6 py-3 flex justify-end gap-3 border-t border-gray-200 dark:border-zinc-600">
                        <button
                            type="button"
                            className="px-4 py-3 bg-gray-400 hover:bg-gray-500 text-gray-800 dark:text-white rounded-md transition-colors font-medium flex items-center gap-2"
                            onClick={onClose}
                        >
                            <ImCancelCircle />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="edit-event-form"
                            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium flex items-center gap-2"
                        >
                            <FaRegCircleCheck />
                            Save Changes
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>

    );
};

export default EditEventModal;