import React,{useState,useEffect} from "react";
import { FaUsers, FaShoppingCart, FaChartLine, FaMoneyBillWave } from "react-icons/fa";

const DashboardPage = () => {
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-green-600">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium">Total Users</div>
              <div className="text-3xl font-bold text-green-600 mt-1">1,245</div>
              <div className="text-sm text-green-600 mt-2">+12% from last week</div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaUsers className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium">Total Orders</div>
              <div className="text-3xl font-bold text-green-600 mt-1">352</div>
              <div className="text-sm text-green-600 mt-2">+5% from last week</div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaShoppingCart className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium">Total Revenue</div>
              <div className="text-3xl font-bold text-green-600 mt-1">$24.5K</div>
              <div className="text-sm text-green-600 mt-2">+18% from last month</div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-500 text-sm font-medium">Growth Rate</div>
              <div className="text-3xl font-bold text-green-600 mt-1">+15%</div>
              <div className="text-sm text-green-600 mt-2">+3% from last quarter</div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaChartLine className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="bg-white text-gray-500">Order ID</th>
                  <th className="bg-white text-gray-500">Customer</th>
                  <th className="bg-white text-gray-500">Status</th>
                  <th className="bg-white text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#ORD-7265</td>
                  <td>John Smith</td>
                  <td><span className="badge bg-green-100 text-green-600 border-0">Completed</span></td>
                  <td>$125.00</td>
                </tr>
                <tr>
                  <td>#ORD-7264</td>
                  <td>Sarah Johnson</td>
                  <td><span className="badge bg-green-100 text-green-600 border-0">Completed</span></td>
                  <td>$75.50</td>
                </tr>
                <tr>
                  <td>#ORD-7263</td>
                  <td>Michael Brown</td>
                  <td><span className="badge bg-yellow-100 text-yellow-600 border-0">Pending</span></td>
                  <td>$237.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">User Activity</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center p-2 border-b">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white mr-3">JS</div>
              <div className="flex-1">
                <div className="font-medium">John Smith</div>
                <div className="text-sm text-gray-500">Placed new order</div>
              </div>
              <div className="text-sm text-gray-500">5 mins ago</div>
            </div>
            <div className="flex items-center p-2 border-b">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white mr-3">SJ</div>
              <div className="flex-1">
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-sm text-gray-500">Updated profile</div>
              </div>
              <div className="text-sm text-gray-500">12 mins ago</div>
            </div>
            <div className="flex items-center p-2 border-b">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white mr-3">MB</div>
              <div className="flex-1">
                <div className="font-medium">Michael Brown</div>
                <div className="text-sm text-gray-500">Joined membership</div>
              </div>
              <div className="text-sm text-gray-500">24 mins ago</div>
            </div>
          </div>
        </div>



        <div class="max-w-sm w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
          <div class="flex justify-between mb-5">
            <div>
              <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">$12,423</h5>
              <p class="text-base font-normal text-gray-500 dark:text-gray-400">Sales this week</p>
            </div>
            <div
              class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
              23%
              <svg class="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4" />
              </svg>
            </div>
          </div>
          <div id="legend-chart"></div>
          <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-5">
            <div class="flex justify-between items-center pt-5">

              <button
                id="dropdownDefaultButton"
                data-dropdown-toggle="lastDaysdropdown"
                data-dropdown-placement="bottom"
                class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                type="button">
                Last 7 days
                <svg class="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>

              <div id="lastDaysdropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                  <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 7 days</a>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a>
                  </li>
                  <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a>
                  </li>
                </ul>
              </div>
              <a
                href="#"
                class="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
                Sales Report
                <svg class="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;