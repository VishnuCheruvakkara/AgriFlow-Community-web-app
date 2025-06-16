import React from 'react'
import SellingProductDeals from '../../components/product-manangement/SellingProductDeals'
import BuyingProductDeals from '../../components/product-manangement/BuyingProductDeals'

function ProductDeals() {
  return (
    <div className="mx-auto">
      <h2 className="text-lg font-medium text-gray-800 mb-3 dark:text-zinc-200">Pending Connections</h2>

      {/* Selling products deals */}
      <SellingProductDeals />

      {/* Buying product deals */}
      <BuyingProductDeals />
      
    </div>
  )
}

export default ProductDeals
