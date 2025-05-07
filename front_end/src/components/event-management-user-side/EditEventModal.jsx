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
                                {({ isSubmitting, setFieldValue, values, handleSubmit }) => (
                                    <Form className="space-y-6">
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
                                            <label className="block text-sm font-medium">Title</label>
                                            <Field
                                                name="title"
                                                className="bg-white text-black w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg"
                                                placeholder="Event Title"
                                            />
                                            <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium">Description</label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                rows="4"
                                                className="bg-white text-black w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg"
                                                placeholder="Event Description"
                                            />
                                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Event Type */}
                                        <div>
                                            <label className="block text-sm font-medium">Event Type</label>
                                            <Field
                                                as="select"
                                                name="eventType"
                                                className="bg-white text-black w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg"
                                            >
                                                <option value="" disabled hidden>-- Select Type --</option>
                                                <option value="online">Online</option>
                                                <option value="offline">Offline</option>
                                            </Field>
                                            <ErrorMessage name="eventType" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Address or Link depending on eventType */}
                                        {values.eventType === 'offline' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium">Address</label>
                                                    <Field
                                                        name="address"
                                                        className="bg-white text-black w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg"
                                                    />
                                                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium">Full Location</label>
                                                    <Field
                                                        name="location.full_location"
                                                        className="bg-white text-black w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg"
                                                    />
                                                    <ErrorMessage name="location.full_location" component="div" className="text-red-500 text-sm" />
                                                </div>
                                            </>
                                        )}
                                        {values.eventType === 'online' && (
                                            <div>
                                                <label className="block text-sm font-medium">Event Link</label>
                                                <Field
                                                    name="link"
                                                    className="bg-white text-black w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg"
                                                />
                                                <ErrorMessage name="link" component="div" className="text-red-500 text-sm" />
                                            </div>
                                        )}

                                        {/* Start Date */}
                                        <div>
                                            <label className="block text-sm font-medium">Start Date</label>
                                            <Field
                                                name="startDate"
                                                type="datetime-local"
                                                className="bg-white text-black w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg"
                                            />
                                            <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Max Participants */}
                                        <div>
                                            <label className="block text-sm font-medium">Max Participants</label>
                                            <Field
                                                name="max_participants"
                                                type="number"
                                                className="bg-white text-black w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg"
                                            />
                                            <ErrorMessage name="max_participants" component="div" className="text-red-500 text-sm" />
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
                                                disabled={isSubmitting}
                                                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium flex items-center gap-2"
                                            >
                                                {isSubmitting ? <PulseLoader size={8} color="#fff" /> : (
                                                    <>
                                                        <FaRegCircleCheck />
                                                        Save changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default EditEventModal;
