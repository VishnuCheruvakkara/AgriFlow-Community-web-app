import React, { useEffect, useState } from "react";
import {
    FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle, FaRegEdit,
    FaEye, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { BsClock, BsCurrencyDollar } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { MdInventory } from "react-icons/md";
import { FaMapLocationDot, FaWeightScale } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
import { showConfirmationAlert } from "../SweetAlert/showConfirmationAlert";
import { showToast } from "../toast-notification/CustomToast";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import DefaultProductImage from "../../assets/images/banner_default_user_profile.png";
import ProductImageGallery from "./ProductImageGallery";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import EditProductModal from "./EditProductModal"; // Import the EditProductModal
import { FaExclamationTriangle } from "react-icons/fa";

const ProductDetailsPage = ({ product, onClose, onDelete, onUpdate }) => {
    const [localProduct, setLocalProduct] = useState({});
    const [imageIndex, setImageIndex] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal

    useEffect(() => {
        setLocalProduct(product);
    }, [product]);

    const images = [localProduct.image1, localProduct.image2, localProduct.image3].filter(Boolean);

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString("en-IN", {
            dateStyle: "full",
            timeStyle: "short",
            timeZone: "Asia/Kolkata"
        });
    };

    // Handle opening edit modal
    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    // Handle closing edit modal
    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    // Handle product update
    const handleProductUpdate = (updatedProduct) => {
        setLocalProduct(updatedProduct);
        // Call parent component's update handler if provided
        if (onUpdate) {
            onUpdate(updatedProduct);
        }
    };

    // Handle delete with confirmation
    const handleDeleteClick = async () => {
        const result = await showConfirmationAlert({
            title: "Delete Product",
            text: "Are you sure you want to delete this product? This action cannot be undone.",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel"
        });

        if (result) {
            try {
                await AuthenticatedAxiosInstance.patch(`/products/soft-delete/${localProduct.id}/`);
                showToast("Product deleted successfully", "success");
                if (onDelete) {
                    onDelete(localProduct.id);
                }
                onClose(); // Close the details page after deletion
            } catch (error) {
                console.error("Error deleting product:", error);
                showToast("Error deleting product", "error");
            }
        }
    };


    return (
        <>
            <div className="flex flex-col w-full rounded-md bg-gray-100 shadow-lg overflow-y-auto no-scrollbar dark:bg-zinc-950 dark:text-zinc-200">
                {/* Header */}
                <div className="text-white bg-gradient-to-r from-green-700 to-green-400 px-4 py-4 flex justify-between items-center dark:from-green-800 dark:to-green-600">
                    <h2 className="text-xl font-semibold text-white">Product Details</h2>
                    <button onClick={onClose} className="border-white hover:border-transparent text-white hover:bg-green-700 rounded-full p-1 transition-colors duration-300 dark:hover:bg-green-800">
                        <RxCross2 className='text-2xl' />
                    </button>
                </div>

                {/* Product Image Slider */}
                <ProductImageGallery product={localProduct} />

                {/* Product Title & Actions */}
                <div className="bg-white py-4 flex flex-col items-center border-b-2 dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="border-b-2 text-center w-full pb-3 dark:border-zinc-800">
                        <h3 className="text-md font-semibold text-green-700 dark:text-green-400">Product "{localProduct.title}"</h3>
                    </div>

                    {/* Edit Button - Now functional */}
                    <button
                        onClick={handleEditClick}
                        className="bg-green-500 mt-5 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg dark:bg-green-600 dark:hover:bg-green-700"
                    >
                        <div className="bg-white rounded-full p-2 dark:bg-zinc-100">
                            <FaRegEdit className="text-green-500" />
                        </div>
                        <span className="text-sm pr-10 pl-4">Edit Product</span>
                    </button>

                    <div className="flex gap-2 mt-3">
                        <p className="text-sm px-2 py-1 rounded-full border bg-green-200 border-green-400 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100">
                            {localProduct.is_available ? "Available" : "Unavailable"}
                        </p>
                    </div>
                </div>

                {/* Product Info */}
                <div className="bg-white p-2 space-y-2 border-b dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="flex text-sm text-gray-700 border border-green-400 bg-green-200 px-2 py-4 rounded-sm dark:bg-green-900 dark:border-green-700 dark:text-green-100">
                        <span className="w-48 font-medium flex items-center gap-4"><RiMoneyRupeeCircleFill size={18} />Price</span>
                        <span className="mr-5">:</span>
                        <span className="font-bold">{`₹${localProduct.price}`}</span>
                    </div>

                    <div className="flex text-sm border border-green-400 bg-green-200 px-2 py-3 rounded-sm dark:bg-green-900 dark:border-green-700 dark:text-green-100">
                        <span className="w-48 font-medium flex items-center gap-4"><MdInventory />Quantity</span>
                        <span className="mr-5">:</span>
                        <span>{localProduct.quantity} {localProduct.unit}</span>
                    </div>

                    <div className="flex text-sm border border-green-400 bg-green-200 px-2 py-3 rounded-sm dark:bg-green-900 dark:border-green-700 dark:text-green-100">
                        <span className="w-48 font-medium flex items-center gap-4"><FaMapLocationDot />Location</span>
                        <span className="mr-5">:</span>
                        <span className="break-words">{localProduct?.location?.full_location}</span>
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col">
                    <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-start"><FaCalendarAlt className="mt-1 mr-3" /><div>
                            <h3 className="text-sm font-medium">Created Date</h3>
                            <p>{formatDateTime(localProduct.created_at)}</p>
                        </div></div>
                    </div>

                    <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-start"><BsClock className="mt-1 mr-3" /><div>
                            <h3 className="text-sm font-medium">Closing Date</h3>
                            <p>{formatDateTime(localProduct.closing_date)}</p>
                        </div></div>
                    </div>

                    <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-start"><FaInfoCircle className="mt-1 mr-3" /><div>
                            <h3 className="text-sm font-medium">About this Product</h3>
                            <p className="whitespace-pre-wrap">{localProduct.description}</p>
                        </div></div>
                    </div>

                    <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-start"><FaMapMarkerAlt className="mt-1 mr-3" /><div>
                            <h3 className="text-sm font-medium">Location Details</h3>
                            <p>{localProduct?.location?.full_location}</p>
                        </div></div>
                    </div>
                </div>

                {/* Delete Button - Now functional */}
                <button
                    onClick={handleDeleteClick}
                    className="flex items-center justify-center gap-2 w-full mt-2 p-4 border-b bg-white hover:bg-red-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-red-900 transition-colors duration-200"
                >
                    <RiDeleteBin5Fill className="text-red-600 dark:text-red-400 text-xl" />
                    <span className="text-red-600 dark:text-red-400 font-bold">Delete Product</span>
                </button>
            </div>

            {/* Edit Product Modal */}
            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                onSave={handleProductUpdate}
                product={localProduct}
            />
        </>
    );
};

export default ProductDetailsPage;