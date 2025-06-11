import React from 'react';
import { ErrorMessage } from 'formik';
import { BsImage } from 'react-icons/bs';

const ImagePreviewBox = ({ 
    imageField, 
    values, 
    setFieldValue, 
    errors, 
    touched, 
    imagePreview,
    onImageChange 
}) => {
    const imageFile = values[imageField];
    const hasPreview = imagePreview;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFieldValue(imageField, file);
        
        if (onImageChange) {
            onImageChange(imageField, file);
        }
    };

    return (
        <div className="space-y-2">
            <div className={`relative border-2 border-dashed rounded-lg h-32 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors
                ${errors[imageField] && touched[imageField]
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800'
                }`}
                onClick={() => document.getElementById(`${imageField}-input`).click()}
            >
                {hasPreview ? (
                    <div className="relative w-full h-full">
                        <img
                            src={hasPreview}
                            alt={`Preview ${imageField}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm">Click to change</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <BsImage className="mx-auto text-gray-400 dark:text-zinc-500 text-2xl mb-2" />
                        <p className="text-sm text-gray-500 dark:text-zinc-400">Click to select image</p>
                    </div>
                )}
            </div>

            <input
                id={`${imageField}-input`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />

            {imageFile && (
                <div className="text-xs text-gray-600 dark:text-zinc-400 truncate">
                    📎 {imageFile.name}
                </div>
            )}

            <ErrorMessage name={imageField} component="div" className="text-red-500 text-xs" />
        </div>
    );
};

export default ImagePreviewBox;