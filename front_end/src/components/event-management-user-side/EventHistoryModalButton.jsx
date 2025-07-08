import React, { useState, useEffect } from "react";
import { MdOutlineHistory } from "react-icons/md";
import useModal from "../../custom-hook/useModal";
import ModalSkeleton from "../Modal/ModalSkeleton";
import EventBannerImage from "../../assets/images/banner_default_user_profile.png";
import { Search } from "lucide-react";
import { ImCancelCircle } from "react-icons/im";
import Select from "react-select";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import FormattedDateTime from "../common-date-time/FormattedDateTime";


const EventHistoryModalButton = () => {
    const { isOpen, openModal, closeModal } = useModal();
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(false);
    const [eventHistory, setEventHistory] = useState([]);

    // for event history search 
    const [searchQuery, setSearchQuery] = useState("");


    const eventStatusOptions = [
        { value: "all", label: "All" },
        { value: "upcoming", label: "Upcoming" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const fetchEventEnrollmentHistory = async () => {
        try {
            setLoading(true);
            const response = await AuthenticatedAxiosInstance.get(
                "/events/get-event-enrollment-history/"
            );
            console.log("Arrived event history :: ", response.data);
            setEventHistory(response.data);
        } catch (error) {
            console.error("Error getting the event history:", error);
        } finally {
            setLoading(false);
        }
    };

    // filter set up  
    const filteredEvents = eventHistory.filter((event) => {
        const matchesStatus =
            filterStatus === "all" || event.event_status === filterStatus;

        const query = searchQuery.toLowerCase();

        const matchesSearch =
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            (event.event_type && event.event_type.toLowerCase().includes(query)) ||
            (event.location_name && event.location_name.toLowerCase().includes(query)) ||
            (event.address && event.address.toLowerCase().includes(query));

        return matchesStatus && matchesSearch;
    });

    return (
        <div>
            {/* Button to open the modal */}
            <button
                onClick={() => {
                    openModal();
                    fetchEventEnrollmentHistory();
                }}
                className="bg-green-500 rounded-full text-white px-1 py-1 flex items-center space-x-2 hover:bg-green-600 transition-colors duration-200 shadow-lg shadow-gray-300 dark:shadow-zinc-900"
            >
                <div className="bg-white dark:bg-white rounded-full p-2">
                    <MdOutlineHistory className="text-green-500" />
                </div>
                <span className="text-sm pr-4">Enrolled Event History</span>
            </button>

            {/* Modal */}
            <ModalSkeleton
                isOpen={isOpen}
                onClose={closeModal}
                title="Event History"
                submitButtonText="Close"
                isSubmitDisabled={false}
                onSubmit={closeModal}
                width="w-[900px]"
                height="h-[600px]"
                showCancelButton={false}
            >
                <div className="space-y-4 my-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search enrolled events, online, offline, location..."
                                className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-lg 
      focus:border-green-400 dark:focus:border-green-400
      transition duration-500 ease-in-out
      bg-white text-gray-800 placeholder-gray-400 
      dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:border-zinc-700"
                            />
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-400"
                                size={20}
                            />
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-300 dark:text-zinc-400"
                            >
                                <ImCancelCircle size={20} />
                            </button>
                        </div>

                        {/* Filter Dropdown */}
                        <div className="w-full md:w-48">
                            <Select
                                value={eventStatusOptions.find((o) => o.value === filterStatus)}
                                onChange={(selected) => setFilterStatus(selected.value)}
                                options={eventStatusOptions}
                                isSearchable={false}
                                classNamePrefix="react-select"
                                placeholder="Filter status..."
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        minHeight: "48px",
                                    }),
                                }}
                            />
                        </div>
                    </div>

                    {/* Dynamic Cards */}
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="border border-gray-300 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800 flex gap-4 group cursor-pointer transition-all duration-300 dark:hover:bg-zinc-900 hover:bg-zinc-100"
                        >
                            {/* Left Side - Image */}
                            <div className="flex-shrink-0">
                                <img
                                    src={event.banner_url ? event.banner_url : EventBannerImage}
                                    alt="Event Banner"
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                            </div>

                            {/* Right Side - Info */}
                            <div className="flex-1 flex flex-col gap-1">
                                {/* Top Row - Title and Tags */}
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 flex-1">
                                        {event.title}
                                    </h3>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${event.event_status === "upcoming"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                : event.event_status === "completed"
                                                    ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                }`}
                                        >
                                            {event.event_status.charAt(0).toUpperCase() + event.event_status.slice(1)}
                                        </span>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${event.event_type === "online"
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                                }`}
                                        >
                                            {event.event_type
                                                ? event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2">
                                    {event.description}
                                </p>

                                {/* Bottom Row - Compact Info */}
                                <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-zinc-500">
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                        < FormattedDateTime date={event.start_datetime} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                        <span>Location: {event.location_name || event.address || "Not specified"}</span>
                                    </div>
                                    {event.country && (
                                        <div className="flex items-center gap-1">
                                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                            <span>Country: {event.country}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </ModalSkeleton>
        </div>
    );
};

export default EventHistoryModalButton;
