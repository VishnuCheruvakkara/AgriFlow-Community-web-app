import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaHandHoldingUsd } from 'react-icons/fa';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import DefaultUserImage from '../../assets/images/user-default.png';
import DefaultProductImage from "../../assets/images/banner_default_user_profile.png"
import { useNavigate } from 'react-router-dom';

function BuyingProductDeals() {
  const [isOpen, setIsOpen] = useState(false);
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();


  const fetchBuyingDeals = async () => {
    try {
      const response = await AuthenticatedAxiosInstance.get('/products/buying-product-deals/');
      setDeals(response.data);
      console.log('Buying product deals:', response.data);
    } catch (error) {
      console.error('Error fetching buying deals:', error);
    }
  };

  useEffect(() => {
    fetchBuyingDeals();
  }, []);

  const NavigateToChat = (deal) => {
    navigate('/user-dash-board/products/farmer-product-chat/', {
      state: {
        receiverId: deal.receiver_id,
        username: deal.other_user,
        profilePicture: deal.other_user_image,
        productId: deal.product_id,
        productName: deal.product_title,
        productImage: deal.product_image,
      }
    });
  };

  return (
    <div className="mb-6 rounded-lg shadow-lg">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={` ripple-parent ripple-white bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
      >
        <div className="flex items-center">
          <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
            <FaHandHoldingUsd className="text-green-600 text-xl" />
          </div>
          <h2 className="text-md font-semibold text-white">Your Buying Products Deals</h2>
          <span className="ml-3 px-2 py-1 border border-green-600 bg-white text-green-600 font-semibold text-xs rounded-full ">
            {deals.length}
          </span>
        </div>
        <div className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}>
          <FaChevronDown className="text-white" />
        </div>
      </div>

      {/* Expandable Content */}
      <div className={` transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-3 border-t-0 border rounded-b-lg border-gray-300 dark:border-zinc-700  bg-white dark:bg-zinc-900">
          <div className="space-y-3">

            {/* dynamic product listing  */}
            <div className="space-y-3">

              {deals.length === 0 ? (
                <div className="text-center border-2 border-dashed border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-zinc-300 py-5 px-4 bg-gray-100 dark:bg-zinc-800 rounded-md">
                  <p className="text-md font-semibold">No deals made yet.</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    You haven’t messaged any sellers yet. Start by exploring a product and sending a message!
                  </p>
                </div>
              ) : (
                deals.map((deal) => {
                  const isDeleted = deal.product_is_deleted;
                  const isUnavailable = !deal.product_is_available;

                  return (
                    <div
                      key={deal.id}
                      className={`flex items-start justify-between border border-gray-300 dark:border-zinc-700 p-4 rounded-lg transition ${(isDeleted || isUnavailable)
                        ? 'bg-gray-100 dark:bg-zinc-800 opacity-60 cursor-default'
                        : 'bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer'
                        }`}
                      onClick={() => {
                        if (!isDeleted && !isUnavailable) {
                          NavigateToChat(deal);
                        }
                      }}
                    >

                      {/* Left Section: Product + Seller Info */}
                      <div className="flex items-start">
                        <div className="h-14 w-14 rounded-md overflow-hidden mr-4 border border-gray-300 dark:border-zinc-600">
                          <img
                            src={deal.product_image || DefaultProductImage}
                            alt="Product"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-800 dark:text-zinc-100">
                            {deal.product_title}
                          </h3>

                          {/* Show tag if deleted */}
                          {(isDeleted || isUnavailable) && (
                            <span className="text-xs italic text-red-600 dark:text-red-400">
                              {isDeleted
                                ? "Product removed by seller"
                                : "Product is not available"}
                            </span>
                          )}

                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600 dark:text-zinc-400">Seller:</span>
                            <div className="h-5 w-5 rounded-full overflow-hidden border border-gray-400">
                              <img
                                src={deal.other_user_image || DefaultUserImage}
                                alt={deal.other_user}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="text-xs text-gray-700 dark:text-zinc-300">{deal.other_user}</span>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-zinc-500">
                            Last message • {new Date(deal.timestamp).toLocaleString('en-IN', {
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

                      {/* Right Section: Last Message */}
                      <div className="chat chat-end">
                        <div className={`chat-bubble ${isDeleted ? 'bg-gray-400' : 'bg-green-600'} text-xs text-white dark:text-zinc-300`}>
                          <span
                            className="block max-w-[200px] truncate overflow-hidden whitespace-nowrap"
                            title={deal.message}
                          >
                            {deal.message}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyingProductDeals;
