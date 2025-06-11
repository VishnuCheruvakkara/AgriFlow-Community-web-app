import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DefaultProductImage from "../../assets/images/banner_default_user_profile.png";

const ProductImageGallery = ({ product }) => {
    const [imageIndex, setImageIndex] = useState(0);
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (product) {
            const { image1, image2, image3 } = product;
            const imageList = [image1, image2, image3].filter(Boolean);
            setImages(imageList.length ? imageList : [DefaultProductImage]);
        }
    }, [product]);

    return (
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-center items-center md:items-start">
            {/* Thumbnail Images (Left) */}
            <div className="flex md:flex-col gap-3 md:w-24">
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        onClick={() => setImageIndex(idx)}
                        className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                            imageIndex === idx
                                ? "border-green-600"
                                : "border-gray-300"
                        }`}
                    />
                ))}
            </div>

            {/* Main Image Viewer (Right) */}
            <div className="relative w-full md:max-w-xl group">
                <div className="overflow-hidden border rounded-md border-gray-300 dark:border-zinc-700">
                    <img
                        src={images[imageIndex]}
                        alt={`Image ${imageIndex + 1}`}
                        className="w-full h-96 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() =>
                                setImageIndex((prev) =>
                                    (prev - 1 + images.length) % images.length
                                )
                            }
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={() =>
                                setImageIndex((prev) =>
                                    (prev + 1) % images.length
                                )
                            }
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
                        >
                            <FaChevronRight />
                        </button>
                    </>
                )}

                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-3 h-3 rounded-full ${
                                idx === imageIndex
                                    ? "bg-white"
                                    : "bg-white bg-opacity-50"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductImageGallery;
