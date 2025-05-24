import React from "react";

const ProductsPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-accent">Order Management</h2>
      <ul className="menu bg-base-300 w-56 rounded-box mt-4">
        <li><a>Order #001</a></li>
        <li><a>Order #002</a></li>
        <li><a>Order #003</a></li>
      </ul>
    </div>
  );
};

export default ProductsPage;
