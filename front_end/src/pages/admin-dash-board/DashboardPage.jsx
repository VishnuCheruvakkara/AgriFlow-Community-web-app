import React, { useState, useEffect } from "react";
import { FaUsers, FaPeopleCarry, FaShoppingBag, FaCalendarAlt } from "react-icons/fa";
import { BsPostcardHeartFill } from "react-icons/bs";
import AdminAuthenticatedAxiosInstance from '../../axios-center/AdminAuthenticatedAxiosInstance';
//user radial chart 
import UserRadialChart from "../../components/admin-dash-board/UserRadialChart";



const DashboardPage = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const FetchDashBoardData = async () => {
      try {
        const response = await AdminAuthenticatedAxiosInstance.get('/dash-board/get-dash-board-data/')
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading("Error fetching data : ", error);
      }
    }

    FetchDashBoardData();
  }, [])

  return (
    <>
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-white bg-gradient-to-r from-green-700 to-green-400 rounded-t-lg p-4">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 ">

          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-xl border border-green-200 dark:border-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 group">
            <div className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-2">
              Total Users / Farmers
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                {data?.cards?.total_users || "0"}
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-2 rounded-lg shadow-sm">
                <FaUsers className="text-green-600 dark:text-green-400 text-lg" />
              </div>
            </div>
          </div>

          {/* Total Products Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-xl border border-green-200 dark:border-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 group">
            <div className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-2">
              Total Products
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                {data?.cards?.total_products || "0"}
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-2 rounded-lg shadow-sm">
                <FaShoppingBag className="text-green-600 dark:text-green-400 text-lg" />
              </div>
            </div>
          </div>

          {/* Total Communities Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-xl border border-green-200 dark:border-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 group">
            <div className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-2">
              Total Communities
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                {data?.cards?.total_communities || "0"}
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-2 rounded-lg shadow-sm">
                <FaPeopleCarry className="text-green-600 dark:text-green-400 text-lg" />
              </div>
            </div>
          </div>

          {/* Total Events Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-xl border border-green-200 dark:border-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 group">
            <div className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-2">
              Total Events
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                {data?.cards?.total_events || "0"}
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-2 rounded-lg shadow-sm">
                <FaCalendarAlt className="text-green-600 dark:text-green-400 text-lg" />
              </div>
            </div>
          </div>

          {/* Total Posts Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-xl border border-green-200 dark:border-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 group">
            <div className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-2">
              Total Posts
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                {data?.cards?.total_posts || "0"}
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-2 rounded-lg shadow-sm">
                <BsPostcardHeartFill className="text-green-600 dark:text-green-400 text-lg" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2-Column Section */}
      <div className=" my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column - Radial Chart */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg  ">
          {/* Heading */}
          <h3 className="text-lg font-semibold p-3 bg-gradient-to-r from-green-700 to-green-400 mb-4 text-white rounded-t-lg">
            User Details
          </h3>
          <div className="px-4 pb-4">


            <UserRadialChart
              data={{
                total_users: data?.user_details?.total_users || 0,
                profile_completed: data?.user_details?.profile_completed || 0,
                aadhaar_verified: data?.user_details?.aadhaar_verified || 0,
                email_verified: data?.user_details?.email_verified || 0,
                active_users: data?.user_details?.active_users || 0,
              }}
            />
          </div>
        </div>

        {/* Right Column - Blank */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-green-200 dark:border-green-600 flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500">Coming Soon</span>
        </div>
      </div>

    </>
  );
};

export default DashboardPage;
