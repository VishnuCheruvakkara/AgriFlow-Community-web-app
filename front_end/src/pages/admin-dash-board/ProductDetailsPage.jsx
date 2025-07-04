import React, { useState, useEffect } from "react";
import { GrMapLocation } from "react-icons/gr";
import {
  MdDelete,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdVerified,
  MdPerson,
  MdAccessTime,
  MdUpdate
} from "react-icons/md";
import { PulseLoader } from 'react-spinners';
import { ImCheckmark2 } from "react-icons/im";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import AdminAuthenticatedAxiosInstance from "../../axios-center/AdminAuthenticatedAxiosInstance";
import MapModal from "../../components/MapLocation/MapModal";
import { FaCheckCircle } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import { showToast } from "../../components/toast-notification/CustomToast";
import { showConfirmationAlert } from "../../components/SweetAlert/showConfirmationAlert";
import ShowEventBannerModal from "../../components/event-management-user-side/ShowEventBannerModal";

const AdminProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  //state for the map modal 
  const [isMapOpen, setIsMapOpen] = useState(false);
  //handle modal for shwo the image
  const [selectedImage, setSelectedImage] = useState(null);


  // Get the single product details based on the product id 
  const getProduct = async () => {
    setLoading(true);
    try {
      const response = await AdminAuthenticatedAxiosInstance.get(
        `/products/admin/get-single-product/${productId}/`
      );
      setProduct(response.data);
      console.log("Fetched product:", response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [productId]);


  // toggle delete product status 
  const toggleDeleteStatus = async (productId, currentStatus) => {
    const newStatus = !currentStatus;
    const actionText = newStatus ? "mark as deleted" : "mark as available";

    // Show confirmation alert before proceeding
    const result = await showConfirmationAlert({
      title: `Confirm Action`,
      text: `Are you sure you want to ${actionText} this product?\n\n(Current status: ${currentStatus ? "Deleted" : "Available"})`,
      confirmButtonText: `Yes, ${newStatus ? "Delete" : "Make Available"}`,
    });
    if (result) {
      try {
        const response = await AdminAuthenticatedAxiosInstance.patch(
          `/products/admin/toggle-delete-status/${productId}/`,
          { is_deleted: !currentStatus }
        );

        console.log("Delete Status updated", response.data);

        // Update local state immediately
        setProduct((prev) => ({
          ...prev,
          is_deleted: !currentStatus,
        }));

        // Proper message depending on new status
        const newStatus = !currentStatus;
        const message = newStatus
          ? "Product status marked as deleted."
          : "Product status marked as available.";

        showToast(message, "success");
      } catch (error) {
        console.error("Failed to toggle delete status", error);
        showToast("Failed to update product status.", "error");
      }
    }
  };


  return (
    <div className="min-h-screen w-full mb-4">
      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <a
              href="/admin/products-management"
              className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              Product Management
            </a>
          </li>
          <li>
            <span className="text-gray-500 dark:text-zinc-400 cursor-default">
              Product Details
            </span>
          </li>
        </ul>
      </div>

      {/* Main Container */}
      <div className="w-full mx-auto bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
          <h1 className="text-xl font-bold">Product Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-300"
            aria-label="Close"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        
        {loading || !product ? (
          <div className="flex flex-col items-center justify-center h-[510px] space-y-3">
            <PulseLoader color="#16a34a" speedMultiplier={1} />
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Loading product details...
            </p>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Images Section */}
              <div className="lg:col-span-1">
                <div className="space-y-3">
                  {/* Main Image */}
                  <div
                    className="relative bg-gray-100 dark:bg-zinc-700 rounded-lg overflow-hidden shadow-md cursor-pointer"
                    onClick={() => setSelectedImage(product.image1)}
                  >
                    <img
                      src={product.image1}
                      alt={product.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                      Main
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="bg-gray-100 dark:bg-zinc-700 rounded-lg overflow-hidden shadow-sm cursor-pointer"
                      onClick={() => setSelectedImage(product.image2)}
                    >
                      <img
                        src={product.image2}
                        alt="Product Image 2"
                        className="w-full h-24 object-cover"
                      />
                    </div>
                    <div
                      className="bg-gray-100 dark:bg-zinc-700 rounded-lg overflow-hidden shadow-sm cursor-pointer"
                      onClick={() => setSelectedImage(product.image3)}
                    >
                      <img
                        src={product.image3}
                        alt="Product Image 3"
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  </div>







                </div>
              </div>

              {/* Product Information */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="border-b border-gray-200 dark:border-zinc-600 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
                      {product.title}
                    </h2>
                    <p className="text-gray-600 dark:text-zinc-200 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ₹{product.price}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-zinc-200">
                          per {product.unit}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className={`flex items-center justify-between p-3 border ${product.is_deleted ? "border-red-400" : "border-green-400"} rounded-lg `}>
                        <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                          Status:
                        </span>

                        {product.is_deleted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-2">
                            <FaTimesCircle className="text-red-600 dark:text-red-400 w-4 h-3" />
                            Deleted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-2">
                            <FaCheckCircle className="text-green-600 dark:text-green-400 w-4 h-3" />
                            Available
                          </span>
                        )}

                      </div>
                      <div className={` flex items-center justify-between p-3 border border-green-400 ${product.is_available ? "border-green-400" : "border-red-400"} rounded-lg `}>
                        <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                          Availability:
                        </span>
                        {product.is_available ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-2">
                            <FaCheckCircle className="text-green-600 dark:text-green-400 w-4 h-3" />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-2">
                            <FaTimesCircle className="text-red-600 dark:text-red-400 w-4 h-3" />
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Quantity & Unit */}
                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                      <div className="flex items-center p-3 border-b border-green-400">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                          <RiShoppingBag3Fill className="text-green-500 w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                          Quantity & Unit
                        </h3>
                      </div>
                      <div className="p-3">
                        <p className="text-gray-600 dark:text-zinc-100 text-lg font-medium">
                          {product.quantity} {product.unit}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-100">
                          Minimum order quantity
                        </p>
                        <p className="text-xs mt-2 text-gray-500 dark:text-zinc-100">
                          <strong>Deal closing date:</strong>{" "}
                          {new Date(product.closing_date).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }).replace(",", " at")}
                        </p>

                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                      <div className="flex items-center p-3 border-b border-green-400">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                          <MdLocationOn className="text-green-600 dark:text-green-400 w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                          Location Details
                        </h3>
                      </div>
                      <div className="p-3 space-y-5">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-zinc-200 text-sm">
                            {product.location.location_name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-zinc-200">
                            {product.location.full_location}
                          </p>
                        </div>

                        <button
                          onClick={() => setIsMapOpen(true)}
                          className="bg-green-500 rounded-full text-white p-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-md mt-2"
                        >
                          <div className="bg-white rounded-full p-2">
                            <GrMapLocation className="text-green-500 text-md" />
                          </div>
                          <span className="text-xs pr-6 pl-2">View on Map</span>
                        </button>


                        <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-300 space-x-4">

                          <span>
                            <strong>Lat:</strong> {product.location.latitude}
                          </span>
                          <span>
                            <strong>Lng:</strong> {product.location.longitude}
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Seller Information */}
                  <div className="bg-zinc-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
                    <div className="flex items-center p-3 border-b border-green-400">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                        <MdPerson className="text-green-600 dark:text-green-400 w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                        Seller Information
                      </h3>
                    </div>
                    <div className="p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-3">
                            <img
                              src={product.seller.profile_picture}
                              alt={product.seller.username}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                            />
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                                {product.seller.username}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-zinc-200">
                                Seller ID: #{product.seller.id}
                              </p>
                              <div className="flex items-center mt-1">
                                <MdVerified className="w-3 h-3 text-green-500 mr-1" />
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                  Verified
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <MdEmail className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-xs text-gray-700 dark:text-zinc-300">
                              {product.seller.email}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MdPhone className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-xs text-gray-700 dark:text-zinc-300">
                              {product.seller.phone_number}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 py-4 border-t border-gray-200 dark:border-zinc-600">
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                {/* Toggle Delete / Restore */}
                {product?.is_deleted ? (
                  <button
                    onClick={() => toggleDeleteStatus(product.id, product.is_deleted)}
                    className="bg-green-500 hover:bg-green-600 rounded-full text-white p-1 flex items-center space-x-2 transition-colors duration-200 shadow-md"
                  >
                    <div className="bg-green-100 rounded-full p-2">
                      <ImCheckmark2 className="text-green-500 text-lg " />
                    </div>
                    <span className="text-sm pr-4 pl-2">Mark as Available</span>
                  </button>
                ) : (
                  <button
                    onClick={() => toggleDeleteStatus(product.id, product.is_deleted)}
                    className="bg-red-500 hover:bg-red-600 rounded-full text-white p-1 flex items-center space-x-2 transition-colors duration-200 shadow-md"
                  >
                    <div className="bg-red-100 rounded-full p-2">
                      <MdDelete className="text-red-500 text-lg" />
                    </div>
                    <span className="text-sm pr-4 pl-2">Mark as Deleted</span>
                  </button>
                )}
              </div>
            </div>


            {/* Footer Timestamps */}
            <div className="pt-4 border-t border-gray-200 dark:border-zinc-600">
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 dark:text-zinc-100">
                <div className="flex items-center mb-1 sm:mb-0">
                  <MdAccessTime className="w-4 h-4 mr-1" />
                  <span>
                    <strong>Created:</strong>{" "}
                    {new Date(product.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <MdUpdate className="w-4 h-4 mr-1" />
                  <span>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(product.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Modal setup  */}
        {isMapOpen && (
          <MapModal
            lat={product?.location?.latitude}
            lng={product?.location?.longitude}
            onClose={() => setIsMapOpen(false)}
          />
        )}

        {/* show image in modal  */}
        {selectedImage && (
          <ShowEventBannerModal
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}


      </div>
      );
};

      export default AdminProductDetailsPage;
