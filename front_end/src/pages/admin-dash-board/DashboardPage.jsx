import React from "react";
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
      </div>
    </div>
  );
};

export default DashboardPage;