import React, { useState, useEffect } from "react";
import { FaUsers, FaPeopleCarry, FaShoppingBag, FaCalendarAlt } from "react-icons/fa";
import { BsPostcardHeartFill } from "react-icons/bs";
import AdminAuthenticatedAxiosInstance from '../../axios-center/AdminAuthenticatedAxiosInstance';
//user radial chart 
import UserRadialChart from "../../components/admin-dash-board/UserRadialChart";
//product metric chart 
import ProductMetricsChart from "../../components/admin-dash-board/ProductMetricsChart";
//Community line chart 
import CommunityLineChart from "../../components/admin-dash-board/CommunityLineChart";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import DefautlCommunityImage from "../../assets/images/banner_default_user_profile.png"
// event horizontal chart 
import EventDetailsHorizontalBar from "../../components/admin-dash-board/EventDetailsHorizontalBar";
import { Link } from "react-router-dom";
//post area chart 
import PostEngagementAreaChart from "../../components/admin-dash-board/PostEngagementAreaChart";

// for commuinity date based filtering 
const options = [
  { value: "year", label: "Year" },
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" }
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  // for commuinity date based filtering 
  const [groupBy, setGroupBy] = useState("month");

  useEffect(() => {
    setLoading(true);
    const FetchDashBoardData = async () => {
      try {
        const response = await AdminAuthenticatedAxiosInstance.get(`/users/get-dash-board-data/?group_by=${groupBy}`)
        setData(response.data);
      } catch (error) {
        // console.error(error);
      } finally {
        setLoading(false);
      }
    }

    FetchDashBoardData();
  }, [groupBy])

  const goToCommunity = (communityId) => {
    navigate(`/admin/community-management/community-details/${communityId}`)
  }
  return (
    <>
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-white bg-gradient-to-r from-green-700 to-green-400 rounded-t-lg p-4">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 ">

          {/* Total Users Card */}
          <Link to="/admin/users-management" className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-xl border border-green-200 dark:border-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 group">
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
          </Link>

          {/* Total Products Card */}
          <Link to="/admin/products-management/" className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-xl border border-green-200 dark:border-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 group">
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
          </Link>

          {/* Total Communities Card */}
          <Link to="/admin/community-management" className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-xl border border-green-200 dark:border-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 group">
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
          </Link>

          {/* Total Events Card */}
          <Link to="/admin/event-management" className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-xl border border-green-200 dark:border-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 group">
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
          </Link>

          {/* Total Posts Card */}
          <Link to="/admin/post-management" className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-xl border border-green-200 dark:border-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 group">
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
          </Link>

        </div>
      </div>

      {/* 2-Column Section */}
      <div className=" my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column - Radial Chart */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg  ">
          {/* Heading */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-700 to-green-400 mb-4 text-white rounded-t-lg">
            <h3 className="text-lg font-semibold m-0">User Details</h3>
            <Link to="/admin/users-management" className="text-xs no-underline hover:underline ">View Details</Link>
          </div>

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
        <div className="bg-white dark:bg-zinc-900 rounded-lg  ">
          {/* Heading */}

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-700 to-green-400 mb-4 text-white rounded-t-lg">
            <h3 className="text-lg font-semibold m-0">Product Details</h3>
            <Link to="/admin/products-management" className="text-xs no-underline hover:underline ">View Details</Link>
          </div>
          <div className="px-4 pb-4">
            <ProductMetricsChart data={data?.product_metrics} />


          </div>
        </div>

      </div>




      {/* for community data  */}
      <div className="my-4 grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-lg">
          {/* Heading */}

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-700 to-green-400 mb-4 text-white rounded-t-lg">
            <h3 className="text-lg font-semibold m-0">Community Details</h3>
            <Link to="/admin/community-management" className="text-xs no-underline hover:underline ">View Details</Link>
          </div>

          {/* Inside content split left & right */}
          <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Side */}
            <div className="  p-4 rounded">
              <div className="mb-3 w-48">
                <Select
                  options={options}
                  value={options.find((o) => o.value === groupBy)}
                  onChange={(selected) => setGroupBy(selected.value)}
                  isSearchable={false}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              <CommunityLineChart data={data?.community_graph} />
            </div>


            {/* Right Side */}
            <div className="p-4 rounded">
              <div className="space-y-6">
                {/* Highly Engaged Communities */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-green-700 dark:text-green-400">
                    Highly Engaged Communities
                  </h4>

                  <table className="w-full text-sm text-left">

                    <tbody>
                      {data?.community_highlights?.most_engaged?.length > 0 ? (
                        data.community_highlights.most_engaged.map((community, index) => (
                          <tr
                            onClick={() => goToCommunity(community?.id)}
                            key={community.id}
                            className=" cursor-pointer border-b border-t hover:bg-zinc-100 dark:hover:bg-zinc-700 border-gray-200 dark:border-zinc-700"
                          >
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">
                              <img
                                src={
                                  community.community_logo ||
                                  DefautlCommunityImage
                                }
                                alt={community.name}
                                className="rounded-full w-8 h-8"
                              />
                            </td>
                            <td className="p-2">{community.name}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="p-2 text-gray-500" colSpan="3">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Communities with Most Participants */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-green-700 dark:text-green-400">
                    Communities with Most Participants
                  </h4>
                  <table className="w-full text-sm text-left">

                    <tbody>
                      {data?.community_highlights?.most_participants?.length > 0 ? (
                        data.community_highlights.most_participants.map(
                          (community, index) => (
                            <tr
                              onClick={() => goToCommunity(community?.id)}
                              key={community.id}
                              className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 border-t border-b border-gray-200 dark:border-zinc-700"
                            >
                              <td className="p-2">{index + 1}</td>
                              <td className="p-2">
                                <img
                                  src={
                                    community.community_logo ||
                                    DefautlCommunityImage
                                  }
                                  alt={community.name}
                                  className="rounded-full w-8 h-8"
                                />
                              </td>
                              <td className="p-2">{community.name}</td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td className="p-2 text-gray-500" colSpan="3">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-700 to-green-400 mb-4 text-white rounded-t-lg">
            <h3 className="text-lg font-semibold m-0">Events Details</h3>
            <Link to="/admin/event-management" className="text-xs no-underline hover:underline ">View Details</Link>
          </div>
          <div className="px-4 pb-4">

            <EventDetailsHorizontalBar data={data?.event_details} />

          </div>
        </div>

        {/* Right Column - Blank */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg  ">
          {/* Heading */}

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-700 to-green-400 mb-4 text-white rounded-t-lg">
            <h3 className="text-lg font-semibold m-0">Posts Details</h3>
            <Link to="/admin/post-management" className="text-xs no-underline hover:underline ">View Details</Link>
          </div>
          <div className="px-4 pb-4">
            <PostEngagementAreaChart data={data?.post_engagement} />
          </div>
        </div>

      </div>

    </>
  );
};

export default DashboardPage;
