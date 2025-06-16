import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaShoppingCart } from 'react-icons/fa';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import DefaultUserImage from '../../assets/images/user-default.png';
import DefaultProductImage from "../../assets/images/banner_default_user_profile.png"
import { useNavigate } from 'react-router-dom';

function SellingProductDeals() {
  const [isOpen, setIsOpen] = useState(false);
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  const fetchProductDeals = async () => {
    try {
      const response = await AuthenticatedAxiosInstance.get('/products/get-selling-product-deals/');
      setDeals(response.data);
      console.log('Product Selling deals:', response.data);
    } catch (error) {
      console.error('Error fetching product deals:', error);
    }
  };

  useEffect(() => {
    fetchProductDeals();
  }, []);

  // navigate to the respective buyer chat page with seller  
  const NavigateToChat = (product, buyerSender) => {
    navigate('/user-dash-board/products/farmer-product-chat/', {
      state: {
        receiverId: buyerSender.id,
        username: buyerSender.username,
        profilePicture: buyerSender.profile_picture,
        productId: product.id,
        productName: product.title,
        productImage: product.image1,

      }
    })
  }

  // navaigate to the product details 
  const handleOpenProductDetails = (productId) => {
    navigate(`/user-dash-board/products/product-details-page/${productId}`)
  }

  return (
    <div className="mb-6 rounded-lg shadow-lg">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`ripple-parent ripple-white bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
      >
        <div className="flex items-center">
          <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
            <FaShoppingCart className="text-green-600 text-xl" />
          </div>
          <h2 className="text-md font-semibold text-white">Your Selling Product Deals</h2>
          <span className="ml-3 px-2 py-1 border border-green-600 bg-white text-green-600 font-semibold text-xs rounded-full">
            {deals.length}
          </span>
        </div>
        <div className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}>
          <FaChevronDown className="text-white" />
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-3 border-t-0 border rounded-b-lg border-zinc-300 dark:border-zinc-700 max-h-96 overflow-y-auto scrollbar-hide bg-white dark:bg-zinc-900">
          <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-hide">

            {deals.length === 0 ? (
              <div className="text-center border-2 border-dashed border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-zinc-300 py-5 px-4 bg-gray-100 dark:bg-zinc-800 rounded-md">
                <p className="text-md font-semibold">You haven’t added any products yet.</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Start selling by adding your first product. Once buyers message you, their interactions will appear here!</p>
              </div>
            ) : (
              deals.map((product) => (
                <div key={product.id} className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg">
                  {/* Product Header */}
                  <div className="p-3 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-700 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <div onClick={() => handleOpenProductDetails(product?.id)} className="cursor-pointer h-12 w-12 rounded-lg overflow-hidden mr-4 border border-zinc-300 dark:border-zinc-600">
                        <img
                          src={product.image1 || DefaultProductImage}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div onClick={() => handleOpenProductDetails(product?.id)} className="cursor-pointer">
                        <h3 className="font-medium text-zinc-800 dark:text-zinc-100">Product: {product.title}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {product.buyers.length} {product.buyers.length === 1 ? 'user is' : 'users are'} interested in this product
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages from Buyers */}
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-700">
                    {product.buyers.map((buyer, idx) => (
                      <div onClick={() => NavigateToChat(product, buyer.sender)} key={idx} className="flex items-center justify-between p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
                        <div className="flex items-center gap-4 ml-2">
                          <div className=" cursor-pointer h-10 w-10 rounded-full overflow-hidden mr-3 border border-zinc-200 dark:border-zinc-600">
                            <img
                              src={buyer.sender.profile_picture || DefaultUserImage}
                              alt={buyer.sender.username}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="cursor-pointer">
                            <p className="font-medium text-zinc-800 dark:text-zinc-100">{buyer.sender.username}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Sent on • {new Date(buyer.timestamp).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="chat chat-end">
                          <div className="chat-bubble bg-green-600 text-xs text-white dark:text-zinc-300">
                            <span className="block max-w-[200px] truncate overflow-hidden whitespace-nowrap" title={buyer.message}>
                              {buyer.message}
                            </span>
                          </div>
                        </div>



                      </div>
                    ))}
                    {product.buyers.length === 0 && (
                      <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300 m-2">
                        <p className="text-sm font-semibold">No buyer messages yet.</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">Buyers who message about this product will appear here.</p>
                      </div>
                    )}
                  </div>
                </div>
              )))}
          </div>
        </div>
      </div>
    </div>);
}

export default SellingProductDeals;
