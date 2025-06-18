import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Add this import
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { ImCancelCircle } from 'react-icons/im';
import { shakeErrorInputVariant } from '../common-animations/ShakingErrorInputVariant';
import { showToast } from '../toast-notification/CustomToast';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import UserLocation from '../user-dash-board/UserLocation';
import DateTimePicker from '../event-management-user-side/DateTimePicker';
import ImagePreviewBox from './ImagePreviewBox';
import {
    productValidationSchema,
    unitChoices,
    initialProductValues
} from '../product-manangement/productValidationSchema ';

//import the common button loader and redux reducers
import ButtonLoader from '../../components/LoaderSpinner/ButtonLoader'
import { showButtonLoader, hideButtonLoader } from '../../redux/slices/LoaderSpinnerSlice';

const AddProductModal = ({ isOpen, onClose, onSave }) => {
    const dispatch = useDispatch(); // Add this line
    const [imagePreviews, setImagePreviews] = useState({
        image1: '',
        image2: '',
        image3: ''
    });

    if (!isOpen) return null;

    const handleImageChange = async (imageField, file, setFieldValue, setFieldError, setFieldTouched) => {
        // Set the field as touched immediately
        setFieldTouched(imageField, true);

        // Clear any previous error
        setFieldError(imageField, undefined);

        if (file) {
            // Validate file type immediately
            const imageFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];

            if (!imageFormats.includes(file.type)) {
                setFieldError(imageField, 'Only image files are allowed');
                setImagePreviews(prev => ({
                    ...prev,
                    [imageField]: ''
                }));
                setFieldValue(imageField, file);
                setFieldError(imageField, 'Only image files are allowed');
                return;
            }

            // Set the file value in Formik
            setFieldValue(imageField, file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => ({
                    ...prev,
                    [imageField]: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        } else {
            // File was cleared/removed
            setFieldValue(imageField, null);
            setFieldError(imageField, `${imageField.charAt(0).toUpperCase() + imageField.slice(1)} is required`);
            setImagePreviews(prev => ({
                ...prev,
                [imageField]: ''
            }));
        }
    };

    const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {

        const buttonId = "addProduct";
        dispatch(showButtonLoader(buttonId)); //show-loader

        try {
            // Log form values before preparing FormData
            console.log('Form Values add products :', values);

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('price', parseFloat(values.price));
            formData.append('quantity', parseInt(values.quantity));
            formData.append('unit', values.unit);
            formData.append('location', JSON.stringify(values.location));
            formData.append('closingTime', values.closingTime.toISOString());

            // Append image files
            if (values.image1) formData.append('image1', values.image1);
            if (values.image2) formData.append('image2', values.image2);
            if (values.image3) formData.append('image3', values.image3);

            const response = await AuthenticatedAxiosInstance.post('/products/create-product-to-sell/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('Product created:', response.data);

            if (onSave) {
                onSave(response.data);
            }

            resetForm();
            setImagePreviews({ image1: '', image2: '', image3: '' });
            onClose();
            showToast("Product added successfully", "success");
        } catch (error) {
            console.error('Error creating product:', error);
            if (error.response?.status === 400 && error.response.data) {
                setErrors(error.response.data);
            }
            showToast("Error adding product", "error");
        } finally {
            setSubmitting(false);
            dispatch(hideButtonLoader(buttonId)); // Hide loader after process
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
                    className="bg-white dark:bg-zinc-800 w-full max-w-4xl rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-700 to-green-400 px-6 py-4 flex justify-between items-center flex-shrink-0">
                        <h2 className="text-xl font-bold text-white">Add New Product</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-green-600 rounded-full p-1"
                            aria-label="Close modal"
                        >
                            <AiOutlineClose size={20} />
                        </button>
                    </div>

                    <Formik
                        initialValues={initialProductValues}
                        validationSchema={productValidationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting, values, errors, touched, setFieldValue, setFieldTouched, setFieldError, submitForm }) => (
                            <>
                                {/* Form - Scrollable Content */}
                                <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
                                    <Form id="add-product-form" className="px-8 space-y-6">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2 dark:text-white">Product Title</label>
                                            <motion.div
                                                variants={shakeErrorInputVariant}
                                                animate={errors.title && touched.title ? 'shake' : ''}>
                                                <Field
                                                    name="title"
                                                    className={`bg-white dark:bg-zinc-900 dark:text-white w-full px-4 mb-1 py-3 border 
                                                    ${errors.title && touched.title ? 'ring-2 ring-red-500 border-none' : ' dark:border-zinc-600 focus:ring-2 focus:ring-green-500'} 
                                                    rounded-lg transition duration-500 ease-out`}
                                                    placeholder="Enter product title"
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
                                                    placeholder="Enter product description"
                                                />
                                            </motion.div>
                                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Price, Quantity, and Unit in Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Price */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2 dark:text-white">Price (INR)</label>
                                                <motion.div
                                                    variants={shakeErrorInputVariant}
                                                    animate={errors.price && touched.price ? 'shake' : ''}>
                                                    <Field
                                                        name="price"
                                                        type="number"
                                                        step="0.01"
                                                        className={`bg-white dark:bg-zinc-900 dark:text-white w-full px-4 mb-1 py-3 border 
                                                        ${errors.price && touched.price ? 'ring-2 ring-red-500 border-none' : ' dark:border-zinc-600 focus:ring-2 focus:ring-green-500'} 
                                                        rounded-lg transition duration-500 ease-out`}
                                                        placeholder="0.00"
                                                    />
                                                </motion.div>
                                                <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                                            </div>

                                            {/* Quantity */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2 dark:text-white">Quantity</label>
                                                <motion.div
                                                    variants={shakeErrorInputVariant}
                                                    animate={errors.quantity && touched.quantity ? 'shake' : ''}>
                                                    <Field
                                                        name="quantity"
                                                        type="number"
                                                        className={`bg-white dark:bg-zinc-900 dark:text-white w-full px-4 mb-1 py-3 border 
                                                        ${errors.quantity && touched.quantity ? 'ring-2 ring-red-500 border-none' : ' dark:border-zinc-600 focus:ring-2 focus:ring-green-500'} 
                                                        rounded-lg transition duration-500 ease-out`}
                                                        placeholder="Enter quantity"
                                                    />
                                                </motion.div>
                                                <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm" />
                                            </div>

                                            {/* Unit */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2 dark:text-white">Unit</label>
                                                <motion.div
                                                    variants={shakeErrorInputVariant}
                                                    animate={errors.unit && touched.unit ? 'shake' : ''}>
                                                    <Field
                                                        as="select"
                                                        name="unit"
                                                        className={`bg-white dark:bg-zinc-900 dark:text-white w-full px-4 mb-1 py-3 border 
                                                    ${errors.unit && touched.unit ? 'ring-2 ring-red-500 border-none' : ' dark:border-zinc-600 focus:ring-2 focus:ring-green-500'} 
                                                    rounded-lg transition duration-500 ease-out`}
                                                    >
                                                        {unitChoices.map((unit) => (
                                                            <option key={unit.value} value={unit.value}>
                                                                {unit.label}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                </motion.div>
                                                <ErrorMessage name="unit" component="div" className="text-red-500 text-sm" />
                                            </div>
                                        </div>

                                        {/* Closing Time */}
                                        <div>
                                            <DateTimePicker
                                                label="Closing Date & Time"
                                                selected={values.closingTime}
                                                onChange={(date) => {
                                                    setFieldValue('closingTime', date);
                                                    setFieldTouched('closingTime', true);
                                                }}
                                                error={errors.closingTime}
                                                touched={touched.closingTime}
                                                shake={true}
                                            />
                                        </div>

                                        {/* Product Images */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium dark:text-white">Product Images (All Required)</h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {/* Image 1 */}
                                                <div>
                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Image 1</label>
                                                    <ImagePreviewBox
                                                        imageField="image1"
                                                        values={values}
                                                        setFieldValue={setFieldValue}
                                                        errors={errors}
                                                        touched={touched}
                                                        imagePreview={imagePreviews.image1}
                                                        onImageChange={(imageField, file) =>
                                                            handleImageChange(imageField, file, setFieldValue, setFieldError, setFieldTouched)
                                                        }
                                                    />
                                                </div>

                                                {/* Image 2 */}
                                                <div>
                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Image 2</label>
                                                    <ImagePreviewBox
                                                        imageField="image2"
                                                        values={values}
                                                        setFieldValue={setFieldValue}
                                                        errors={errors}
                                                        touched={touched}
                                                        imagePreview={imagePreviews.image2}
                                                        onImageChange={(imageField, file) =>
                                                            handleImageChange(imageField, file, setFieldValue, setFieldError, setFieldTouched)
                                                        }
                                                    />
                                                </div>

                                                {/* Image 3 */}
                                                <div>
                                                    <label className="block text-sm font-medium mb-2 dark:text-white">Image 3</label>
                                                    <ImagePreviewBox
                                                        imageField="image3"
                                                        values={values}
                                                        setFieldValue={setFieldValue}
                                                        errors={errors}
                                                        touched={touched}
                                                        imagePreview={imagePreviews.image3}
                                                        onImageChange={(imageField, file) =>
                                                            handleImageChange(imageField, file, setFieldValue, setFieldError, setFieldTouched)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <motion.div
                                                variants={shakeErrorInputVariant}
                                                animate={errors.location && touched.location ? 'shake' : 'idle'}
                                            >
                                                <UserLocation
                                                    formData={values}
                                                    setFormData={(newFormData) => {
                                                        // Update Formik's values with the location data
                                                        if (newFormData.location) {
                                                            setFieldValue('location', newFormData.location);
                                                            setFieldTouched('location.full_location', true);
                                                        }
                                                    }}
                                                />
                                            </motion.div>
                                        </div>
                                    </Form>
                                </div>

                                {/* Fixed Footer Buttons */}
                                <div className="bg-gray-100 dark:bg-zinc-700 px-6 py-3 flex justify-end gap-3 border-t border-gray-200 dark:border-zinc-600 flex-shrink-0">
                                    <button
                                        type="button"
                                        className="px-4 py-3 bg-gray-400 hover:bg-gray-500 text-gray-800 dark:text-white rounded-md transition-colors font-medium flex items-center gap-2"
                                        onClick={onClose}
                                    >
                                        <ImCancelCircle />
                                        Cancel
                                    </button>
                                    <ButtonLoader
                                        buttonId="addProduct"
                                        type="button"
                                        onClick={submitForm}
                                        className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium flex items-center gap-2"
                                    >
                                        <FaRegCircleCheck />
                                        Add Product
                                    </ButtonLoader>
                                </div>
                            </>
                        )}
                    </Formik>
                </motion.div>
            </div>
        </div>
    );
};

export default AddProductModal;