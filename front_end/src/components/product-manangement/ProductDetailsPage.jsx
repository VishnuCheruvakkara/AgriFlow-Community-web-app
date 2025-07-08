import React, { useEffect, useState } from "react";
import {
    FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle, FaRegEdit,
    FaEye, FaChevronLeft, FaChevronRight, FaUser, FaEnvelope, FaPhone
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
import { useSelector } from "react-redux";
import MapModal from "../MapLocation/MapModal";
import { GrMapLocation } from "react-icons/gr";
import DefaultUserImage from "../../assets/images/user-default.png"
import { useParams, useNavigate } from "react-router-dom";
import { GrContact } from "react-icons/gr";
import ProductDetailsShimmer from "../shimmer-ui-component/ProductDetailsShimmer";


const ProductDetailsPage = () => {

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    //get product Id from the previous page 
    const { productId } = useParams();
    console.log("PRoduct9898 id is :::: ,", productId)

    const [showMapModal, setShowMapModal] = useState();
    const [localProduct, setLocalProduct] = useState({});
    const [imageIndex, setImageIndex] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
    const userId = useSelector((state) => state.user.user?.id)

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await AuthenticatedAxiosInstance.get(`/products/get-single-product-details/${productId}/`);
                setLocalProduct(response.data);
            } catch (error) {
                console.error("Failed to fetch product details:", error);
                showToast("Error loading product details", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [productId]);

    console.log("Local product is :::::", localProduct)

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
                navigate("/user-dash-board/products/my-products");

            } catch (error) {
                console.error("Error deleting product:", error);
                showToast("Error deleting product", "error");
            }
        }
    };


    // Handle product update
    const handleProductUpdate = (updatedProduct) => {
        setLocalProduct(updatedProduct);

    };

    const NavigateToChat = () => {

        const seller = localProduct?.seller;
        navigate('/user-dash-board/products/farmer-product-chat/', {
            state: {
                receiverId: seller?.id,
                username: seller?.username,
                profilePicture: seller?.profile_picture,
                productId: localProduct?.id,
                productName: localProduct?.title,
                productImage: localProduct?.image1,
            }
        })
    }

    // Active and Inactive setup for the product 
    const handleAvailabilityToggle = async (newValue) => {
        const result = await showConfirmationAlert({
            title: localProduct.is_available ? "Mark as Unavailable" : "Mark as Available",
            text: localProduct.is_available
                ? "Are you sure you want to mark this product as unavailable? buyer cannot buy this product."
                : "Are you sure you want to mark this product as available again? Buyers will be able to see and purchase it.",
            confirmButtonText: localProduct.is_available ? "Mark Unavailable" : "Mark Available",
            cancelButtonText: "Cancel"
        });

        if (result) {
            try {

                // Update local state optimistically
                setLocalProduct((prev) => ({
                    ...prev,
                    is_available: newValue,
                }));

                // Call your backend
                await AuthenticatedAxiosInstance.patch(`/products/toggle-product-state/${localProduct.id}/`, {
                    is_available: newValue,
                });

                showToast("Product availability updated!", "success");
            } catch (error) {
                // Revert local state on error
                setLocalProduct((prev) => ({
                    ...prev,
                    is_available: !newValue,
                }));

                showToast("Failed to update availability.", "error");
            }
        }
    };


    // show the shimmer while loading the page 
    if (loading) {
        return <ProductDetailsShimmer />;
    }


    return (
        <>
            <div className="flex flex-col w-full rounded-md bg-gray-100 shadow-lg overflow-y-auto no-scrollbar dark:bg-zinc-950 dark:text-zinc-200">
                {/* Header */}
                <div className="text-white bg-gradient-to-r from-green-700 to-green-400 px-4 py-4 flex justify-between items-center dark:from-green-800 dark:to-green-600">
                    <h2 className="text-xl font-semibold text-white">Product Details</h2>
                    <button onClick={() => navigate(-1)} className="border-white hover:border-transparent text-white hover:bg-green-700 rounded-full p-1 transition-colors duration-300 dark:hover:bg-green-800">
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

                    {userId === localProduct?.seller?.id &&
                        <button
                            onClick={handleEditClick}
                            className="bg-green-500 mt-5 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg dark:bg-green-600 dark:hover:bg-green-700"
                        >
                            <div className="bg-white rounded-full p-2 dark:bg-zinc-100">
                                <FaRegEdit className="text-green-500" />
                            </div>
                            <span className="text-sm pr-10 pl-4">Edit Product</span>
                        </button>
                    }

                    {userId !== localProduct?.seller?.id && (
                        localProduct?.is_available ? (
                            <button
                                onClick={NavigateToChat}
                                className="bg-green-500 mt-5 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg dark:bg-green-600 dark:hover:bg-green-700"
                            >
                                <div className="bg-white rounded-full p-2 dark:bg-zinc-100">
                                    <GrContact className="text-green-500" />
                                </div>
                                <span className="text-sm pr-10 pl-4">Contact Farmer</span>
                            </button>
                        ) : (
                            <div
                                className="bg-gray-400 mt-5 rounded-full text-white px-1 py-1 flex items-center space-x-2 opacity-70 cursor-not-allowed dark:bg-zinc-700"
                            >
                                <div className="bg-gray-300 rounded-full p-2 dark:bg-zinc-600">
                                    <GrContact className="text-white" />
                                </div>
                                <span className="text-sm pr-10 pl-4">Product is not available</span>
                            </div>
                        )
                    )}





                </div>

                {/* Product Info */}
                <div className="bg-white p-2 space-y-2 border-b dark:bg-zinc-900 dark:border-zinc-800">
                    {userId === localProduct?.seller?.id &&


                        <div
                            onClick={() => handleAvailabilityToggle(!localProduct.is_available)}
                            className={`relative w-full flex items-center justify-center cursor-pointer transition-colors duration-300
                            text-sm
                            ${localProduct.is_available
                                    ? "border border-green-400 bg-green-200 hover:bg-green-300 dark:bg-green-900 dark:border-green-700 dark:hover:bg-green-800 dark:text-green-100 text-gray-700"
                                    : "border border-red-400 bg-red-200 hover:bg-red-300 dark:bg-red-900 dark:border-red-700 dark:hover:bg-red-700 text-gray-700 dark:text-green-100"
                                }
                                    px-2 py-4 rounded-sm
                                `}
                        >
                            <div className="font-medium">
                                {localProduct.is_available ? "Available" : "Unavailable"}
                            </div>
                        </div>



                    }

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

                </div>




                {/* Details */}
                <div className="flex flex-col">
                    <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-start"><FaCalendarAlt className="mt-1 mr-3 flex-shrink-0" /><div>
                            <h3 className="text-sm  font-semibold">Created Date</h3>
                            <p>{formatDateTime(localProduct.created_at)}</p>
                        </div></div>
                    </div>

                    <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-start"><BsClock className="mt-1 mr-3 flex-shrink-0" /><div>
                            <h3 className="text-sm  font-semibold">Closing Date</h3>
                            <p>{formatDateTime(localProduct.closing_date)}</p>
                        </div></div>
                    </div>

                    <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-start "><FaInfoCircle className="mt-1 mr-3 flex-shrink-0" /><div>
                            <h3 className="text-sm font-semibold">About this Product</h3>
                            <p className="whitespace-pre-wrap">{localProduct.description}</p>
                        </div></div>
                    </div>

                    <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-start"><FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" /><div>
                            <h3 className="text-sm  font-semibold">Location Details</h3>
                            <p>{localProduct?.location?.full_location}</p>
                        </div>

                        </div>
                        <div className="py-4 pl-7">
                            <button
                                onClick={() => setShowMapModal(true)}
                                className="bg-green-500 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg shadow-gray-300 dark:shadow-zinc-800"
                            >
                                <div className="bg-white rounded-full p-2">
                                    <GrMapLocation className="text-green-500 text-lg" />
                                </div>
                                <span className="text-sm pr-10 pl-4">View Location on Map</span>
                            </button>
                        </div>

                    </div>
                </div>

                {/* Delete Button - Now functional */}
                {userId === localProduct?.seller?.id &&
                    <button
                        onClick={handleDeleteClick}
                        className="flex items-center justify-center gap-2 w-full mt-2 p-4 border-b bg-white hover:bg-red-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-red-900 transition-colors duration-200"
                    >
                        <RiDeleteBin5Fill className="text-red-600 dark:text-red-400 text-xl" />
                        <span className="text-red-600 dark:text-red-400 font-bold">Delete Product</span>
                    </button>
                }

            </div>

            {/* Edit Product Modal */}
            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                onSave={handleProductUpdate}
                product={localProduct}
            />
            {/* show the location modal  */}
            <AnimatePresence>
                {showMapModal && (
                    <MapModal
                        lat={localProduct?.location?.latitude}
                        lng={localProduct?.location?.longitude}
                        onClose={() => setShowMapModal(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductDetailsPage;