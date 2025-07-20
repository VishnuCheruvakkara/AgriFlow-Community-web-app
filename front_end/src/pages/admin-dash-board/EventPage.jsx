import React, { useState, useEffect, useCallback } from 'react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import AdminAuthenticatedAxiosInstance from '../../axios-center/AdminAuthenticatedAxiosInstance';
import FormattedDateTime from '../../components/common-date-time/FormattedDateTime';
import { debounce } from 'lodash';
import { RiSearchLine } from 'react-icons/ri';
import { ImCancelCircle } from 'react-icons/im';
import NoEventsFound from "../../assets/images/no_result_search.png"
import { PulseLoader } from 'react-spinners';
import AdminSidePagination from "../../components/Common-Pagination/AdminSidePagination";
import { FaMapMarkedAlt } from 'react-icons/fa';
import { FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function EventManagementPage() {
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  // search set up  
  const [searchEvent, setSearchEvent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //filter status 
  const [filterStatus, setFilterStatus] = useState("");

  const handleFilterChange = (status) => {
    setCurrentPage(1);
    setFilterStatus(status);
  };

  const getAllEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AdminAuthenticatedAxiosInstance.get("/events/admin/get-all-event/", {
        params: {
          page: currentPage,
          search: searchEvent.trim() !== "" ? searchEvent : undefined,
          status: filterStatus || ""
        }
      })
      setEvents(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5));
    } catch (error) {
      // console.error("Error fetching events", error)
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchEvent, filterStatus])

  //Debounce for search 
  const debouncedSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      setSearchEvent(value);
    }, 300), []
  )

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  return (
    <div className="mb-4 max-w-full bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
        <h1 className="text-xl font-bold">Event Management</h1>
      </div>

      {/* Filter Options */}
      <div className="my-4 mx-2 px-2">
        <div className="flex flex-col sm:flex-row bg-green-100 dark:bg-zinc-600 rounded-lg overflow-hidden shadow-md">

          <button
            className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "" ? "bg-green-600" : "bg-green-400"
              } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("")}
          >
            All Events
          </button>

          <button
            className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "upcoming" ? "bg-green-600" : "bg-green-400"
              } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("upcoming")}
          >
            Upcomming
          </button>
          <button
            className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "completed" ? "bg-green-600" : "bg-green-400"
              } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("completed")}
          >
            Completed
          </button>
          <button
            className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "cancelled" ? "bg-green-600" : "bg-green-400"
              } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("cancelled")}
          >
            Cancelled
          </button>
          <button
            className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base ${filterStatus === "deleted" ? "bg-green-600" : "bg-green-400"
              } text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out`}
            onClick={() => handleFilterChange("deleted")}
          >
            Deleted
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="pb-4 bg-white dark:bg-zinc-800 px-4 py-2 border-t border-zinc-300 dark:border-zinc-600 shadow-lg">
          <div className="flex justify-between items-center my-4">
            <h3 className="font-bold text-gray-700 dark:text-zinc-200">Event Management</h3>
          </div>

          {/* Search Bar */}
          <div className="flex items-center border border-zinc-300 my-4 focus-within:border-green-500 dark:focus-within:border-green-500 dark:border-zinc-700 w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm px-3 py-2 transition duration-300 ease-in-out">
            {/* Search Icon */}
            <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />

            {/* Input */}
            <input
              type="text"
              placeholder="Search Events..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="flex-1 outline-none px-2 py-1 text-gray-700 dark:text-zinc-200 bg-transparent placeholder-gray-500 dark:placeholder-zinc-400"
            />
            {/* Cancel Button */}
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue('');
                  debouncedSearch('');
                }}
                className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                aria-label="Clear search"
              >
                <ImCancelCircle size={18} />
              </button>
            )}
          </div>

          {/* Table with loader overlay */}
          {/* Events Table with Loading and Empty States */}
          {loading ? (
            <div className="flex justify-center items-center py-28">
              <PulseLoader color="#16a34a" speedMultiplier={1} />
            </div>
          ) : events.length > 0 ? (
            <div className="relative">
              <div className="overflow-x-auto border border-gray-300 dark:border-zinc-600 rounded-lg">
                <table className="w-full bg-white dark:bg-zinc-800 shadow-md">
                  <thead className="bg-gray-100 border-b dark:bg-zinc-900 dark:border-zinc-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Banner</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Start Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Participants</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">About</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-zinc-200 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-600">
                    {events.map((event, index) => (
                      <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition">
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-zinc-300">
                          {index + 1}
                        </td>
                        {/* Banner */}
                        <td className="px-4 py-4">
                          <div className="h-12 w-12 border dark:border-zinc-500 rounded-md overflow-hidden bg-gray-200 dark:bg-zinc-600">
                            <img
                              src={event.banner_url}
                              alt={event.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        {/* Title */}
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-zinc-100">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-green-500 w-4 h-4 shrink-0" />
                            {event.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-zinc-400">
                            {event.description}
                          </div>
                        </td>
                        {/* Type */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap px-2 py-2
      ${event.event_type === 'online'
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                              }`}
                          >
                            {event.event_type === 'online' ? (
                              <>
                                <FaGlobe className="w-3 h-3" />
                                Online
                              </>
                            ) : (
                              <>
                                <FaMapMarkedAlt className="w-3 h-3" />
                                Offline
                              </>
                            )}
                          </span>
                        </td>

                        {/* Start Date */}
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                          <div className="flex items-center gap-1">
                            <FaClock className="text-green-500 w-4 h-4 shrink-0" />
                            <FormattedDateTime date={event.start_datetime} />
                          </div>
                        </td>
                        {/* Location */}
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-green-500 w-4 h-4 shrink-0" />
                            {event.location_name}
                          </div>
                        </td>
                        {/* Participants */}
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                          <div className="flex items-center gap-1">
                            <FaUsers className="text-green-500 w-4 h-4 shrink-0" />
                            {event.participants_count} / {event.max_participants}
                          </div>
                        </td>
                        {/* About */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap px-2 py-2 ${event.event_status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : event.event_status === 'cancelled'
                                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              }`}
                          >
                            {event.event_status === 'completed' && <FaCheckCircle className="w-3 h-3" />}
                            {event.event_status === 'cancelled' && <FaTimesCircle className="w-3 h-3" />}
                            {event.event_status !== 'completed' && event.event_status !== 'cancelled' && (
                              <FaClock className="w-3 h-3" />
                            )}
                            {event.event_status}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap px-2 py-2 ${event.is_deleted
                              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                              : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              }`}
                          >
                            {event.is_deleted ? (
                              <>
                                <FaTrash className="w-3 h-3" />
                                Deleted
                              </>
                            ) : (
                              <>
                                <FaCheckCircle className="w-3 h-3" />
                                Available
                              </>
                            )}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <div className="flex justify-center gap-2">
                            <Link 
                            to={`/admin/event-management/event-details/${event.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                              title="View Details"
                            >
                              <FaEye size={22} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-10 px-4 bg-gray-100 rounded-md dark:bg-zinc-900 dark:border-zinc-700 mt-6">
              <img
                src={NoEventsFound} // You can use a suitable image here
                alt="No Events"
                className="mx-auto w-64 object-contain"
              />
              <p className="text-lg font-semibold dark:text-zinc-400">No Events Found</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Try adjusting your filters or check again later.
              </p>
              <button
                onClick={() => setSearchKeyword("")} // Optional: for clearing filters
                className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination  */}
          <AdminSidePagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasPrev={currentPage > 1}
            hasNext={currentPage < totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />

        </div>
      </div>
    </div>
  );
}

export default EventManagementPage;
