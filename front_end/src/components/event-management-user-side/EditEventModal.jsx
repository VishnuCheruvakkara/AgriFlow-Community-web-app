import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { PulseLoader } from 'react-spinners';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import BannerImageUpload from '../image-uploader/BannerImageUpload';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { ImCancelCircle } from 'react-icons/im';
import { eventValidationSchema } from '../common-erro-handling/EventCreationErrorHandler';
import { shakeErrorInputVariant } from '../common-animations/ShakingErrorInputVariant';

const EditEventModal = ({ isOpen, onClose, eventData, onSave }) => {
    if (!isOpen || !eventData) return null;

    const initialValues = {
        title: eventData.title || '',
        description: eventData.description || '',
        max_participants: eventData.max_participants || '',
        eventType: eventData.eventType || '',
        address: eventData.address || '',
        link: eventData.link || '',
        startDate: eventData.startDate || '',
        banner: eventData.banner || null,
        location: eventData.location || { full_location: '' },
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999]">
                {/* Overlay */}
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

                {/* Modal content */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.85, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 40 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden"
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
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        await onSave(values);
                                        onClose();
                                    } catch (error) {
                                        console.error('Error saving:', error);
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting, setFieldValue, values, handleSubmit, errors, touched }) => (
                                    <Form id="edit-event-form" className="space-y-6 px-12">
                                        {/* Banner Upload */}
                                        <div className="flex justify-center">
                                            <BannerImageUpload
                                                onImageSelect={(file) => setFieldValue('banner', file)}
                                                purpose="eventBanner"
                                            />
                                        </div>
                                        <ErrorMessage name="banner" component="div" className="text-red-500 text-sm text-center" />

                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Event title</label>
                                            <motion.div
                                                variants={shakeErrorInputVariant}
                                                animate={errors.title && touched.title ? 'shake' : ''}>
                                                <Field
                                                    name="title"
                                                    className={`bg-white text-black w-full px-4 mb-1 py-3 border 
                                                ${errors.title && touched.title ? ' ring-2 ring-red-500' : ' border-gray-300  focus:ring-2 focus:ring-green-500'} 
                                                rounded-lg transition duration-500 ease-out`}
                                                    placeholder="Event Title"
                                                />
                                            </motion.div>

                                            <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Description</label>
                                            <motion.div
                                                variants={shakeErrorInputVariant}
                                                animate={errors.description && touched.description ? 'shake' : ''}
                                            >
                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    rows="4"
                                                    className={`bg-white text-black w-full px-4  py-3 border 
                                                        ${errors.description && touched.description ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-green-500'} 
                                                        rounded-lg transition duration-500 ease-out`}
                                                    placeholder="Event Description"
                                                />
                                            </motion.div>
                                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Max Participants */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Max Participants</label>
                                            <motion.div
                                                variants={shakeErrorInputVariant}
                                                animate={errors.max_participants && touched.max_participants ? 'shake' : ''}>
                                                <Field
                                                    name="max_participants"
                                                    type="number"
                                                    className={`bg-white text-black w-full px-4 mb-1 py-3 border 
                                                        ${errors.max_participants && touched.max_participants ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-green-500'} 
                                                        rounded-lg transition duration-500 ease-out`}
                                                    placeholder="Enter a positive number "
                                                />
                                            </motion.div>
                                            <ErrorMessage name="max_participants" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Event Type */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Event Type</label>
                                            <motion.div
                                                variants={shakeErrorInputVariant}
                                                animate={errors.eventType && touched.eventType ? 'shake' : ''}>
                                                <Field
                                                    as="select"
                                                    name="eventType"
                                                    className={`bg-white text-black w-full px-4 mb-1 py-3 border cursor-pointer
                                                        ${errors.eventType && touched.eventType ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-green-500'} 
                                                        rounded-lg transition duration-500 ease-out`}
                                                >
                                                    <option value="" disabled hidden>-- Select Type --</option>
                                                    <option value="online">Online</option>
                                                    <option value="offline">Offline</option>
                                                </Field>
                                            </motion.div>
                                            <ErrorMessage name="eventType" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Address or Link depending on eventType */}
                                        {values.eventType === 'offline' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium">Address</label>
                                                    <motion.div
                                                        variants={shakeErrorInputVariant}
                                                        animate={errors.address && touched.address ? 'shake' : ''}>
                                                        <Field
                                                            name="address"
                                                            className={`bg-white text-black w-full px-4 mb-1 py-3 border 
                                                                ${errors.address && touched.address ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-green-500'} 
                                                                rounded-lg transition duration-500 ease-out`}
                                                        />
                                                    </motion.div>
                                                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium">Full Location</label>
                                                    <motion.div
                                                        variants={shakeErrorInputVariant}
                                                        animate={errors['location.full_location'] && touched['location.full_location'] ? 'shake' : ''}>
                                                        <Field
                                                            name="location.full_location"
                                                            className={`bg-white text-black w-full px-4 mb-1 py-3 border 
                                                                ${errors['location.full_location'] && touched['location.full_location'] ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-green-500'} 
                                                                 rounded-lg transition duration-500 ease-out`}
                                                        />
                                                    </motion.div>
                                                    <ErrorMessage name="location.full_location" component="div" className="text-red-500 text-sm" />
                                                </div>
                                            </>
                                        )}
                                        {values.eventType === 'online' && (
                                            <div>
                                                <label className="block text-sm font-medium">Event Link</label>
                                                <motion.div
                                                    variants={shakeErrorInputVariant}
                                                    animate={errors.link && touched.link ? 'shake' : ''}>
                                                    <Field
                                                        name="link"
                                                        className={`bg-white text-black w-full px-4 mb-1 py-3 border 
                                                            ${errors.link && touched.link ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-green-500'} 
                                                             rounded-lg transition duration-500 ease-out`}
                                                    />
                                                </motion.div>
                                                <ErrorMessage name="link" component="div" className="text-red-500 text-sm" />
                                            </div>
                                        )}

                                        {/* Start Date */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Start Date</label>
                                            <motion.div
                                                variants={shakeErrorInputVariant}
                                                animate={errors.startDate && touched.startDate ? 'shake' : ''}>
                                                <Field
                                                    name="startDate"
                                                    type="datetime-local"
                                                    className={`bg-white text-black w-full px-4 mb-1 py-3 border 
                                                        ${errors.startDate && touched.startDate ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-green-500'} 
                                                         rounded-lg transition duration-500 ease-out`}
                                                />
                                            </motion.div>
                                            <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        

                                    </Form>
                                )}
                            </Formik>
                        </div>
                        {/* Footer Buttons */}
                        <div className="bg-gray-100 px-6 py-3 flex justify-end gap-3 border-t border-gray-200">
                            <button
                                type="button"
                                className="px-4 py-3 bg-gray-400 hover:bg-gray-500 text-gray-800 rounded-md transition-colors font-medium flex items-center gap-2"
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
        </AnimatePresence>
    );
};

export default EditEventModal;