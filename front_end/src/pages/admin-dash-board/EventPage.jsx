import React, { useState, useEffect } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { ImCancelCircle } from 'react-icons/im';
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

function EventManagementPage() {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllEvents = async () => {
    setLoading(true);
    try {
      const response = await AdminAuthenticatedAxiosInstance.get("/events/admin/get-all-event/")
      console.log("Arrived all events admin side :::: ", response.data)
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events", error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <div className="mb-4 max-w-full bg-white dark:bg-zinc-800 shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white">
        <h1 className="text-xl font-bold">Event Management</h1>
      </div>

      {/* Filter Options */}
      <div className="my-4 mx-2 px-2">
        <div className="flex flex-col sm:flex-row bg-green-100 dark:bg-zinc-600 rounded-lg overflow-hidden shadow-md">
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-600 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            All Events
          </button>
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-400 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            Upcoming
          </button>
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-400 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            Completed
          </button>
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-400 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
            Cancelled
          </button>
          <button className="flex-1 py-2 sm:py-3 px-1 sm:px-2 text-center font-medium text-xs sm:text-sm md:text-base bg-green-400 text-white hover:bg-green-600 hover:brightness-110 transition duration-300 ease-in-out">
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
            <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />
            <input
              type="text"
              placeholder="Search Events..."
              className="flex-1 outline-none px-2 py-1 text-gray-700 dark:text-zinc-200 bg-transparent placeholder-gray-500 dark:placeholder-zinc-400"
            />
            <button className="text-gray-500 hover:text-red-500 transition-colors duration-300">
              <ImCancelCircle size={18} />
            </button>
          </div>

          {/* Table with loader overlay */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex items-center justify-center z-10">
                <div className="text-gray-700 dark:text-zinc-200 font-medium">Loading...</div>
              </div>
            )}

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
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
                    >
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-zinc-300">
                        {index + 1}
                      </td>

                      {/* Banner Image Column */}
                      <td className="px-4 py-4">
                        <div className="h-12 w-12 border dark:border-zinc-500 rounded-md overflow-hidden bg-gray-200 dark:bg-zinc-600">
                          <img
                            src={event.banner_url}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-zinc-100">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-green-500 w-4 h-4 shrink-0" />
                          {event.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-zinc-400">
                          {event.description}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                        {event.event_type}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="flex items-center gap-1">
                          <FaClock className="text-green-500 w-4 h-4 shrink-0" />
                          <FormattedDateTime date={event.start_datetime} />
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-green-500 w-4 h-4 shrink-0" />
                          {event.location_name}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="flex items-center gap-1">
                          <FaUsers className="text-green-500 w-4 h-4 shrink-0" />
                          {event.participants_count} / {event.max_participants}
                        </div>
                      </td>

                      {/* ABOUT column */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full whitespace-nowrap px-2 py-2 ${event.event_status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : event.event_status === 'cancelled'
                              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            }`}
                        >
                          {event.event_status === 'completed' && (
                            <FaCheckCircle className="w-3 h-3" />
                          )}
                          {event.event_status === 'cancelled' && (
                            <FaTimesCircle className="w-3 h-3" />
                          )}
                          {event.event_status !== 'completed' &&
                            event.event_status !== 'cancelled' && (
                              <FaClock className="w-3 h-3" />
                            )}
                          {event.event_status}
                        </span>
                      </td>

                      {/* STATUS column */}
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

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                            title="View Details"
                          >
                            <FaEye size={22} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>




          </div>
        </div>
      </div>
    </div>
  );
}

export default EventManagementPage;
