import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import * as Yup from 'yup';
import DateTimePicker from '../../components/event-management-user-side/DateTimePicker';
import BannerImageUpload from '../../components/image-uploader/BannerImageUpload';
import { shakeErrorInputVariant } from '../../components/common-animations/ShakingErrorInputVariant';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { eventValidationSchema } from '../common-erro-handling/EventCreationErrorHandler';

function CreateEventForm({ selectedCommunity, onBack }) {
    const [startDate, setStartDate] = useState(null);
    return (
        <div className="max-w-full mx-auto px-4">

            <div className="text-center mb-4">
                <div className="flex justify-center mb-3">
                    <button
                        onClick={onBack}
                        className="bg-green-500 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg shadow-gray-300"
                    >
                        <div className="bg-white rounded-full p-2">
                            <IoArrowBackCircleSharp className="text-green-500" />
                        </div>
                        <span className="text-sm pr-4">Back to Select Community</span>
                    </button>
                </div>

                <h2 className="text-xl font-bold text-green-600 mb-2">
                    Create Event for : <span className="text-green-600">{selectedCommunity?.name}</span>
                </h2>
                <p className="text-gray-600 text-sm">Share an amazing experience with your community</p>
            </div>



            <Formik
                initialValues={{
                    title: '',
                    description: '',
                    eventType: '',
                    location: '',
                    address: '',
                    link: '',
                    startDate: null,
                    banner: null,
                }}
                validationSchema={eventValidationSchema}
                validateOnChange={true}
                validateOnBlur={true}
                onSubmit={(values) => {
                    console.log('Submitted values:', values);
                }}
            >
                {({ setFieldValue, values, errors, touched, handleChange }) => (
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
                                            setFieldValue('location', '');
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <motion.div
                                        variants={shakeErrorInputVariant}
                                        animate={errors.location && touched.location ? 'shake' : 'idle'}
                                    >
                                        <Field
                                            name="location"
                                            className={`bg-white text-black w-full px-4 py-3 border rounded-lg 
                           ${errors.location && touched.location ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
                                            placeholder="Where will it be held?"
                                        />
                                    </motion.div>
                                    <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-2" />
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
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                            >
                                Create Event
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CreateEventForm
