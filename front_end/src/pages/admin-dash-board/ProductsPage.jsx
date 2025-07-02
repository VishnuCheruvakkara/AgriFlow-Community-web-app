import React, { useEffect, useState } from "react";
import NoProductsFound from "../../assets/images/no-product-found.png"
import { RiSearchLine } from "react-icons/ri";
import AdminAuthenticatedAxiosInstance from "../../axios-center/AdminAuthenticatedAxiosInstance";
import { PulseLoader } from 'react-spinners';
import { FaTimesCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await AdminAuthenticatedAxiosInstance.get("/products/admin/get-all-product/");
        setProducts(response.data);
        console.log("All products admin side::", response.data)

      } catch (error) {
        setError("Failed to load products.")
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, [])


  return (
    <>
      <div className="mb-4 max-w-full bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
          <h1 className="text-2xl font-bold">Product Management</h1>
        </div>

        {/* Filter Buttons */}
        <div className="my-4 mx-2 px-2 ">
          <div className="flex bg-green-100 dark:bg-zinc-600 rounded-lg overflow-hidden shadow-md">
            <button className="flex-1 py-2 md:py-3 px-1 text-center font-medium text-xs md:text-sm bg-green-600 text-white hover:brightness-110 transition duration-300">
              All
            </button>
            <button className="flex-1 py-2 md:py-3 px-1 text-center font-medium text-xs md:text-sm bg-green-400 text-white hover:bg-green-600 transition duration-300">
              Available
            </button>
            <button className="flex-1 py-2 md:py-3 px-1 text-center font-medium text-xs md:text-sm bg-green-400 text-white hover:bg-green-600 transition duration-300">
              Unavailable
            </button>
            <button className="flex-1 py-2 md:py-3 px-1 text-center font-medium text-xs md:text-sm bg-green-400 text-white hover:bg-green-600 transition duration-300">
              Deleted
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1  gap-6 ">
          <div className="pb-4 bg-white dark:bg-zinc-800 px-4 py-2 border-t border-zinc-300  dark:border-zinc-600 shadow-lg">
            <h3 className="font-bold text-gray-700 dark:text-zinc-200 my-4">Product List</h3>

            {/* Search Bar */}
            <div className="flex border border-zinc-300 my-4 focus-within:border-green-500 dark:focus-within:border-green-500 dark:border-zinc-700 first-letter:items-center w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-3 transition duration-300 ease-in-out">
              <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />
              <input
                type="text"
                placeholder="Search Products..."
                className="w-full outline-none px-2 text-gray-700 dark:text-zinc-200 bg-transparent placeholder-gray-500 dark:placeholder-zinc-400"
              />
            </div>


            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-28">
                <PulseLoader color="#16a34a" speedMultiplier={1} />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="overflow-x-auto border border-gray-300 dark:border-zinc-600 rounded-lg">
                  <table className="w-full bg-white dark:bg-zinc-800 shadow-md">
                    <thead className="bg-gray-100 border-b dark:bg-zinc-900 dark:border-zinc-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Seller</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Deleted</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">View</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-600">
                      {products.map((product, index) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
                        >
                          {/* # */}
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-zinc-300">
                            {index + 1}
                          </td>
                          {/* Image */}
                          <td className="px-4 py-4">
                            <div className="h-12 w-12 border dark:border-zinc-500 rounded-md overflow-hidden bg-gray-200 dark:bg-zinc-600">
                              <img
                                src={product.image1}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>
                          {/* Title */}
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-zinc-100">
                            {product.title}
                          </td>
                          {/* Seller */}
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                            {product.seller?.username}
                            <div className="text-sm text-gray-500 dark:text-zinc-400">{product?.seller?.email}</div>

                          </td>
                          {/* Price */}
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                            ₹{product.price} / {product.unit}
                          </td>
                          {/* Status */}
                          <td className="px-4 py-4">
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
                          </td>

                          {/* Deleted */}
                          <td className="px-4 py-4">
                            {product.is_deleted ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-2">
                                <FaTimesCircle className="text-red-600 dark:text-red-400 w-4 h-3" />
                                Deleted
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-2">
                                <FaCheckCircle className="text-green-600 dark:text-green-400 w-4 h-3" />
                                Active
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            <div className="flex gap-2 justify-center">
                              <Link className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition">
                                <button>
                                  <FaEye size={22} />
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-10 px-4 bg-gray-100 rounded-md dark:bg-zinc-900 dark:border-zinc-700 mt-6">
                <img
                  src={NoProductsFound}
                  alt="No Products"
                  className="mx-auto w-64 object-contain"
                />
                <p className="text-lg font-semibold dark:text-zinc-400">No Products Found</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                  onClick={() => window.location.reload()}
                >
                  Reload
                </button>
              </div>
            )}




          </div>
        </div>

      </div>

    </>

  );
};

export default ProductsPage;
