import React, { useState, useEffect, useCallback } from 'react';
import { FaMapMarkerAlt, FaRegCalendarAlt, FaEye, FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import DefaultProductImage from '../../assets/images/banner_default_user_profile.png';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import ProductsNotFound from '../../assets/images/no-product-found.png';
import EventPageShimmer from '../../components/shimmer-ui-component/EventPageShimmer';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../components/toast-notification/CustomToast';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { ImCancelCircle } from 'react-icons/im';

function WishList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchWishlist = async (query = '') => {
    setLoading(true);
    try {
      const response = await AuthenticatedAxiosInstance.get(
        `/products/wishlist/my-wish-list-items/`,
        {
          params: query ? { search: query } : {}, // pass query if exists
        }
      );
      const results = response.data.results || [];
      console.log("Wishlist :::", results);
      setProducts(results);
      setWishlist(results.map(item => item.product_id));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };


  const debouncedFetchWishlist = useCallback(
    debounce((query) => fetchWishlist(query), 500),
    []
  );

  useEffect(() => {
    if (search.trim()) {
      debouncedFetchWishlist(search);
    } else {
      fetchWishlist();
    }
  }, [search]);

  const toggleWishlist = async (productId) => {
    const isInWishlist = wishlist.includes(productId);
    setWishlistLoadingId(productId);

    try {
      await AuthenticatedAxiosInstance.post('/products/wishlist/toggle-status/', {
        product_id: productId
      });

      setWishlist((prev) =>
        isInWishlist ? prev.filter((id) => id !== productId) : [...prev, productId]
      );

      setProducts((prev) =>
        isInWishlist ? prev.filter((p) => p.product_id !== productId) : prev
      );

      showToast(isInWishlist ? "Removed from wishlist" : "Added to wishlist", isInWishlist ? "info" : "success");
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast("Error toggling wishlist", "error");
    } finally {
      setWishlistLoadingId(null);
    }
  };

  const handleOpenProductDetails = (productId) => {
    navigate(`/user-dash-board/products/product-details-page/${productId}`);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-gray-800 dark:text-zinc-200 mb-4">My Wishlist</h2>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search wishlist..."
          className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
               transition duration-500 ease-in-out
               bg-white text-gray-800 placeholder-gray-400 
               dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:border-zinc-700"
        />
        {/* Optional: Add a search icon inside input */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-400" size={20} />

        {/* Clear button (visible only when text is entered) */}
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
              <p className="text-lg font-semibold dark:text-zinc-100">No Products Found in your wish list!</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {search ? "Try a different keyword." : "No available products at the moment."}
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg border border-gray-300 hover:shadow-xl transition duration-500 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
              >
                <div className="relative">
                  <img
                    src={product.image1 || DefaultProductImage}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <div className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                    Wishlist
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-semibold">
                    ₹{product.price} per {product.unit}
                  </div>
                </div>

                <h3 className="text-md font-bold text-green-700 dark:text-green-400 mt-2">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-zinc-300 truncate">
                  {product.description}
                </p>

                <div className="mt-2 text-xs text-gray-600 dark:text-zinc-400">
                  <FaRegCalendarAlt className="inline mr-1 text-green-500" />
                  Closing at: {new Date(product.closing_date).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Kolkata'
                  })}
                </div>

                <div className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                  <FaMapMarkerAlt className="inline mr-1 text-green-500" />
                  {product.location?.location_name || ''}, {product.location?.country}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleOpenProductDetails(product.product_id)}
                    className="flex-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2 dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    <FaEye size={16} /> View Product
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.product_id)}
                    disabled={wishlistLoadingId === product.product_id}
                    className={`ml-3 w-10 h-10 flex items-center justify-center rounded-md border-2 transition duration-300
                      ${wishlist.includes(product.product_id)
                        ? 'border-green-500 text-green-500'
                        : 'border-gray-400 text-gray-400 hover:border-green-500 hover:text-green-500'}
                      ${wishlistLoadingId === product.product_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {wishlistLoadingId === product.product_id ? (
                      <FaSpinner className="animate-spin" />
                    ) : wishlist.includes(product.product_id) ? (
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
    </div>
  );
}

export default WishList;
