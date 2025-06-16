import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaHandHoldingUsd } from 'react-icons/fa';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';
import DefaultUserImage from '../../assets/images/user-default.png';

function BuyingProductDeals() {
  const [isOpen, setIsOpen] = useState(false);
  const [deals, setDeals] = useState([]);

  const fetchBuyingDeals = async () => {
    try {
      const response = await AuthenticatedAxiosInstance.get('/products/buying-deals/');
      setDeals(response.data);
      console.log('Buying product deals:', response.data);
    } catch (error) {
      console.error('Error fetching buying deals:', error);
    }
  };

  useEffect(() => {
    fetchBuyingDeals();
  }, []);

  return (
    <div className="mb-6 rounded-lg shadow-lg">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`ripple-parent ripple-white bg-gradient-to-r from-green-700 to-green-400 flex justify-between items-center p-4 cursor-pointer ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
      >
        <div className="flex items-center">
          <div className="bg-white rounded-full mr-3 flex items-center justify-center w-10 h-10">
            <FaHandHoldingUsd className="text-green-600 text-xl" />
          </div>
          <h2 className="text-md font-semibold text-white">Your Buying Products Deals</h2>
          <span className="ml-3 px-2 py-1 border border-green-600 bg-white text-green-600 font-semibold text-xs rounded-full">
            {deals.length}
          </span>
        </div>
        <div className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}>
          <FaChevronDown className="text-white" />
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-3 border-t-0 border rounded-b-lg border-gray-300 bg-white">
          <div className="space-y-3">
            {deals.length === 0 ? (
              <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-5 px-4 bg-gray-100 rounded-md">
                <p className="text-md font-semibold">No buying interactions yet.</p>
                <p className="text-xs text-gray-500">Products you message about will appear here.</p>
              </div>
            ) : (
              deals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between border border-gray-300 p-3 bg-white rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md overflow-hidden mr-4">
                      <img
                        src={deal.product_image || DefaultUserImage}
                        alt="Product"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{deal.product_title}</h3>
                      <p className="text-sm text-gray-600">Seller: <span className="font-semibold">{deal.other_user}</span></p>
                      <p className="text-xs text-gray-500">
                        Last message • {new Date(deal.timestamp).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-sm text-gray-700 max-w-[200px] truncate">{deal.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyingProductDeals;
