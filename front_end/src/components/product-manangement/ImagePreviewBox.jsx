import React from 'react';
import { ErrorMessage } from 'formik';
import { BsImage } from 'react-icons/bs';
import { GoPaperclip } from "react-icons/go";

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
            <div className={`relative border-2 border-dashed rounded-lg h-32 flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:border-opacity-80
                ${errors[imageField] && touched[imageField]
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700'
                }`}
                onClick={() => document.getElementById(`${imageField}-input`).click()}
            >
                {hasPreview ? (
                    <div className="relative w-full h-full group">
                        <img
                            src={hasPreview}
                            alt={`Preview ${imageField}`}
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm rounded-lg">
                            <div className="text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-sm font-medium">Click to change</p>
                                <div className="w-8 h-0.5 bg-white mx-auto mt-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 delay-100"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center transform transition-all duration-300 group hover:scale-110">
                        <BsImage className="mx-auto text-gray-400 dark:text-zinc-500 text-2xl mb-2 transition-all duration-300 hover:text-gray-600 dark:hover:text-zinc-300" />
                        <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors duration-300 hover:text-gray-700 dark:hover:text-zinc-200">Click to select image</p>
                        <div className="w-6 h-0.5 bg-gray-400 dark:bg-zinc-500 mx-auto mt-2 transform scale-x-0 hover:scale-x-100 transition-transform duration-300 delay-75"></div>
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
                <div className="text-xs flex text-gray-600 dark:text-zinc-400 truncate transform transition-all duration-200 hover:scale-105">
                    <GoPaperclip className=" flex-shrink-0 mr-2 mt-1"/> {imageFile.name}
                </div>
            )}

            <ErrorMessage name={imageField} component="div" className="text-red-500 text-xs" />
        </div>
    );
};

export default ImagePreviewBox;