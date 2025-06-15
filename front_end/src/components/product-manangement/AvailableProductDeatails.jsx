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
import { GrContact } from "react-icons/gr";
import { useNavigate, useNavigation } from "react-router-dom";

const AvailableProductDetails = ({ product, onClose, onDelete, onUpdate }) => {
    const navigate = useNavigate()
    const [showMapModal, setShowMapModal] = useState();
    const [localProduct, setLocalProduct] = useState({});
    const [imageIndex, setImageIndex] = useState(0);
    const userId = useSelector((state) => state.user.user?.id)

    const NavigateToChat = () => {

        const seller = localProduct?.seller;
        navigate('/user-dash-board/products/farmer-product-chat/', {
            state: {
                receiverId: seller?.id,
                username: seller?.username,
                profilePicture: seller?.profile_picture,
                productId: localProduct?.id,
                productName:localProduct?.title,
                productImage:localProduct?.image1,

            }
        })
    }

    useEffect(() => {
        setLocalProduct(product);
    }, [product]);
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

                    <button
                        onClick={NavigateToChat}
                        className=" bg-green-500 mt-5 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg dark:bg-green-600 dark:hover:bg-green-700"
                    >
                        <div className="bg-white rounded-full p-2 dark:bg-zinc-100">
                            < GrContact className="text-green-500" />
                        </div>
                        <span className="text-sm pr-10 pl-4">Contact Farmer</span>
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



                {/* Seller Details - Only show if current user is not the seller */}

                <div className="bg-white mt-2 p-4 border-b dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="flex items-start">
                        <FaUser className="mt-1 mr-3 text-green-600" />
                        <div className="flex-1">
                            <h3 className="text-sm font-medium mb-3">Seller Details</h3>

                            {/* Seller Profile Picture */}
                            <div className="flex items-center mb-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-400 mr-3">
                                    <img
                                        src={localProduct?.seller?.profile_picture || DefaultUserImage}
                                        alt="Seller Profile"
                                        className="w-full h-full object-cover"

                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-green-700 dark:text-green-400">
                                        {localProduct?.seller?.username}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                    <FaEnvelope className="mr-2 text-green-600" />
                                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                    <span className="ml-2 text-green-600 dark:text-green-400">
                                        {localProduct?.seller?.email}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm">
                                    <FaPhone className="mr-2 text-green-600" />
                                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                                    <span className="ml-2 text-green-600 dark:text-green-400">
                                        {localProduct?.seller?.phone_number}
                                    </span>
                                </div>
                            </div>
                        </div>
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

            </div>



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

export default AvailableProductDetails;