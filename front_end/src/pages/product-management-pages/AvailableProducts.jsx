import React, { useState, useEffect, useCallback } from 'react';
import { FaMapMarkerAlt, FaRegCalendarAlt, FaEye, FaRegHeart, FaHeart, FaSpinner } from 'react-icons/fa';
import { Search } from 'lucide-react';
import { ImCancelCircle } from "react-icons/im";
import DefaultProductImage from '../../assets/images/banner_default_user_profile.png';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import debounce from 'lodash/debounce';
import Pagination from '../../components/Common-Pagination/UserSidePagination';
import ProductsNotFound from '../../assets/images/no-product-found.png';
import EventPageShimmer from '../../components/shimmer-ui-component/EventPageShimmer';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../components/toast-notification/CustomToast';

function AvailableProducts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // wish list functionality
  const [wishlist, setWishlist] = useState([]);
  // wish list toggling loader 
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);

  // Add or remove product from the wishlist
  const toggleWishlist = async (productId) => {
    const isInWishlist = wishlist.includes(productId);  // check current state
    setWishlistLoadingId(productId);

    try {
      const response = await AuthenticatedAxiosInstance.post('/products/wishlist/toggle-status/', {
        product_id: productId
      });

      // Update local state first
      setWishlist((prev) =>
        isInWishlist
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );

      // Show appropriate toast message
      if (isInWishlist) {
        showToast("Product removed from wishlist", "info");
      } else {
        showToast("Product added to wishlist", "success");
      }

      console.log(response.data.message);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast("Error toggling wishlist ", "error");
    } finally {
      setWishlistLoadingId(null); // End loading
    }

  };

  //Get the prodcuts from wishlist 
  const fetchWishlist = async () => {
    try {
      const response = await AuthenticatedAxiosInstance.get('/products/wishlist/my-products/');
      const wishlistProductIds = response.data.map(item => item.product_id);
      setWishlist(wishlistProductIds);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);



  const fetchProducts = async (query = '', page = 1) => {
    try {
      setLoading(true);

      const response = await AuthenticatedAxiosInstance.get(
        `/products/get-all-available-products/?search=${query}&page=${page}`
      );

      // Log the entire response data
      console.log("Fetched products response:", response.data);

      // Fix the filter to correctly exclude deleted products
      const availableOnly = response.data.results

      setProducts(availableOnly);
      setTotalPages(Math.ceil(response.data.count / 6));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching available products:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchProducts = useCallback(
    debounce((query) => fetchProducts(query, 1), 500),
    []
  );

  useEffect(() => {
    if (search !== "") {
      debouncedFetchProducts(search);
    } else {
      fetchProducts('', 1);
    }
  }, [search, debouncedFetchProducts]);

  const handlePageChange = (newPage) => {
    fetchProducts(search, newPage);
  };

  const handleOpenProductDetails = (productId) => {
    navigate(`/user-dash-board/products/product-details-page/${productId}`)
  }

  return (
    <div>


      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-800 dark:text-zinc-200">Available Products</h2>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search available products..."
          className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                        transition duration-500 ease-in-out
                        bg-white text-gray-800 placeholder-gray-400 
                        dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:border-zinc-700"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-400" size={20} />
        {search.length > 0 && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 dark:hover:text-red-500 dark:text-zinc-400 transition-colors duration-300"
          >
            <ImCancelCircle size={20} />
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <EventPageShimmer key={index} />)
          : products.length === 0 ? (
            <div className="col-span-3 text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md 
                        dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300">
              <img
                src={ProductsNotFound}
                alt="No Products"
                className="mx-auto w-64 object-contain"
              />
              <p className="text-lg font-semibold dark:text-zinc-100">No Products Found!</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {search ? "Try a different keyword." : "No available products at the moment."}
              </p>
            </div>
          ) : (




            products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg border border-gray-300 hover:shadow-xl transition duration-500 flex flex-col h-full dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:shadow-zinc-700/50"
              >
                <div className="flex-1">
                  <div className="relative">
                    <img
                      src={product.image1 || DefaultProductImage}
                      alt={product.title}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />

                    <div
                      className={`
    absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full
    ${product.is_available ? 'bg-green-500' : 'bg-red-500'}
    text-white
    opacity-100
  `}
                    >
                      {product.is_available ? 'Available' : 'Not Available'}
                    </div>


                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-semibold">
                      ₹{product.price} per {product.unit}
                    </div>
                  </div>

                  <h3 className="text-md font-bold text-green-700 border-t border-green-500 pt-2 dark:text-green-400 dark:border-green-600">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-gray-700 text-xs line-clamp-3 dark:text-zinc-300 truncate w-40">
                    {product.description}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-zinc-400 font-semibold">
                    <FaRegCalendarAlt className="mr-1 text-green-500 dark:text-green-400" />
                    <span>
                      Closing at: {new Date(product.closing_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-600 dark:text-zinc-400">
                    <FaMapMarkerAlt className="mr-1 text-green-500 dark:text-green-400" />
                    <span>{product.location?.location_name}, {product.location?.country}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenProductDetails(product?.id)}
                    className="flex-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2 dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    <FaEye size={16} /> View Product
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    disabled={wishlistLoadingId === product.id}
                    className={`ml-3 w-10 h-10 flex items-center justify-center rounded-md border-2 transition duration-300
    ${wishlist.includes(product.id)
                        ? 'border-green-500 text-green-500'
                        : 'border-gray-400 text-gray-400 hover:border-green-500 hover:text-green-500'}
    ${wishlistLoadingId === product.id && 'opacity-50 cursor-not-allowed'}
  `}
                  >
                    {wishlistLoadingId === product.id ? (
                      <FaSpinner className="animate-spin" />
                    ) : wishlist.includes(product.id) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>

                </div>


              </div>
            ))
          )}



      </div>

      {/* Pagination */}
      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          hasPrev={currentPage > 1}
          hasNext={currentPage < totalPages}
        />

      )}
    </div>
  );
}

export default AvailableProducts;
