import React from "react";

const ProductsPage = () => {
  // Example products data — replace with your API data
  const products = [
    { id: 1, title: "Fresh Mangoes", status: "Available", price: 200 },
    { id: 2, title: "Organic Rice", status: "Unavailable", price: 500 },
    { id: 3, title: "Honey Bottle", status: "Available", price: 300 },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-md p-4 hidden md:block">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Product Menu</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <a href="#" className="block px-3 py-2 rounded hover:bg-green-100">All Products</a>
          </li>
          <li>
            <a href="#" className="block px-3 py-2 rounded hover:bg-green-100">Available</a>
          </li>
          <li>
            <a href="#" className="block px-3 py-2 rounded hover:bg-green-100">Unavailable</a>
          </li>
          <li>
            <a href="#" className="block px-3 py-2 rounded hover:bg-green-100">Deleted</a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-green-800">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage and review all products here</p>
        </header>

        {/* Products Table */}
        <div className="overflow-x-auto bg-white rounded shadow p-4">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-green-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-green-50">
                  <td className="border border-gray-300 px-4 py-2">{prod.title}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        prod.status === "Available"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {prod.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">₹{prod.price}</td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
