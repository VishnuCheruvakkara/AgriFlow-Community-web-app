import React, { useState, useEffect, useCallback } from 'react';
import { FaMapMarkerAlt, FaRegCalendarAlt, FaEye, FaPlus } from 'react-icons/fa';
import { Search } from 'lucide-react';
import { ImCancelCircle } from "react-icons/im";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DefaultProductImage from '../../assets/images/banner_default_user_profile.png';
import { MdAddShoppingCart } from "react-icons/md";
import AddProductModal from "../../components/product-manangement/AddProdcutModal"
import { showToast } from '../../components/toast-notification/CustomToast';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import debounce from 'lodash/debounce';
import Pagination from '../../components/Common-Pagination/UserSidePagination';
import ProductsNotFound from '../../assets/images/no-product-found.png';
import EventPageShimmer from '../../components/shimmer-ui-component/EventPageShimmer';
import ProductDetailsPage from '../../components/product-manangement/ProductDetailsPage';
import { useNavigate } from 'react-router-dom';

function MyProducts() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    //selected product for the product details page 
    const [selectedProduct, setSelectedProduct] = useState(null);

    //state for handle the add product modal 
    const [showAddProductModal, setShowAddProductModal] = useState(false);

    const handleProductSave = (newProduct) => {
        fetchProducts('', 1);  // Refetch page 1 with updated data
        setCurrentPage(1);     // Optional: Reset to page 1 if needed
    };

    //fetch all the products created bu the current user 
    const fetchProducts = async (query = ' ', page = 1) => {
        try {
            setLoading(true);
            const response = await AuthenticatedAxiosInstance.get(`/products/get-all-products/?search=${query}&page=${page}`);
            setProducts(response.data.results)
            setTotalPages(Math.ceil(response.data.count / 6))
            setCurrentPage(page);

        } catch (error) {
            // console.error("Error while fetching the data : ", error);
        } finally {
            setLoading(false);
        }
    }

    //Add debounce 
    const debouncedFetchProducts = useCallback(
        debounce((query) => {
            fetchProducts(query, 1);
        }, 500),
        []
    );

    useEffect(() => {
        if (search !== "") {
            debouncedFetchProducts(search);
        } else {
            fetchProducts('', 1);
        }
    }, [search, debouncedFetchProducts])

    // hanle pagination buttons 
    const handlePageChange = (newPage) => {
        fetchProducts(search, newPage)
    }

    const handleOpenProductDetails = (productId) => {
        navigate(`/user-dash-board/products/product-details-page/${productId}`)
    }

    return (
        <div>
            {/* Header with Add Product Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-800 dark:text-zinc-200">My Products</h2>

                <button
                    onClick={() => setShowAddProductModal(true)}
                    className="bg-green-500 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600  transition-colors duration-200 shadow-lg shadow-gray-300 dark:shadow-zinc-900"
                >
                    <div className="bg-white dark:bg-white rounded-full p-2">
                        < MdAddShoppingCart className="text-green-500 " />
                    </div>
                    <span className="text-sm pr-4">Add Product</span>
                </button>

            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products, category, location..."
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                               transition duration-500 ease-in-out
                               bg-white text-gray-800 placeholder-gray-400 
                               dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:border-zinc-700"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-400" size={20} />
                {/* Clear search button - conditional rendering placeholder */}
                {search.length > 0 && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500  dark:hover:text-red-500 transition-colors duration-300 dark:text-zinc-400"
                    >
                        <ImCancelCircle size={20} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {
                    loading ? Array.from({ length: 6 }).map((_, index) => < EventPageShimmer key={index} />)
                        :
                        products.length === 0 ? (
                            <div className="col-span-3 text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md 
                  dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300">
                                <img
                                    src={ProductsNotFound}
                                    alt="No Products"
                                    className="mx-auto w-64 object-contain"
                                />
                                <p className="text-lg font-semibold dark:text-zinc-100">No Products Found!</p>
                                <p className="text-xs text-gray-500 dark:text-zinc-400">
                                    {search ? "Try using a different search keyword." : "There are currently no products available."}
                                </p>
                            </div>
                        ) : (
                            products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="bg-white p-4 rounded-lg border border-gray-300 hover:shadow-xl transition duration-500 ease-in-out flex flex-col h-full dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:shadow-zinc-700/50"
                                >
                                    <div className="flex-1">
                                        {/* Product Image */}
                                        <div className="relative group">
                                            <img
                                                src={product.image1 || DefaultProductImage}
                                                alt={product.title}
                                                className="w-full h-40 object-cover rounded-md mb-3"
                                            />


                                            {/* Price Badge */}
                                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-semibold">
                                                ₹{product.price} per {product.unit}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-md font-bold text-green-700 border-t border-green-500 pt-2 dark:text-green-400 dark:border-green-600">
                                            {product.title}
                                        </h3>

                                    
                                        {/* Description */}
                                        <p className="mt-1 text-gray-700 text-xs line-clamp-3 dark:text-zinc-300 truncate w-40">
                                            {product.description}
                                        </p>


                                        {/* Listed Date */}
                                        <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-zinc-400 font-semibold">
                                            <FaRegCalendarAlt className="mr-1 text-green-500 dark:text-green-400" />
                                            <span > Closing at : {new Date(product.closing_date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                                timeZone: 'Asia/Kolkata'
                                            })}</span>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center mt-1 text-xs text-gray-600 dark:text-zinc-400">
                                            <FaMapMarkerAlt className="mr-1 text-green-500 dark:text-green-400" />
                                            <span>{product.location?.location_name}, {product.location?.country}</span>
                                        </div>
                                    </div>

                                    {/* View Button */}
                                    <div className="mt-4 flex gap-2">
                                        <button onClick={()=>handleOpenProductDetails(product?.id)} className="flex-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2 dark:bg-green-600 dark:hover:bg-green-700">
                                            <FaEye size={16} /> View
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
            </div>

            {/* Pagination Placeholder */}
            {!loading && totalPages >= 1 &&
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    hasPrev={currentPage > 1}
                    hasNext={currentPage < totalPages}
                />
            }

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={showAddProductModal}
                onClose={() => setShowAddProductModal(false)}
                onSave={handleProductSave}
            />
        </div>
    );
}

export default MyProducts;