import React, { useState, useCallback } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { debounce } from "lodash";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import { TbInfoCircleFilled } from "react-icons/tb";

const UserLocation = ({ formData, setFormData, errors, fieldErrors, defaultQuery }) => {
    const [query, setQuery] = useState(defaultQuery || "");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationSelected, setLocationSelected] = useState(false);
    const [localError, setLocalError] = useState("");
    const [noDataFound, setNoDataFound] = useState(false);

    const fetchLocations = useCallback(async (searchQuery) => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            setNoDataFound(false);
            return;
        }

        setLoading(true);
        setNoDataFound(false);
        try {
            const response = await AuthenticatedAxiosInstance.get(`/users/location-autocomplete/?q=${searchQuery}`);
            setSuggestions(response.data);
            setNoDataFound(response.data.length === 0);
        } catch (error) {
            // console.error("Error fetching locations:", error);
            setNoDataFound(true);
        }
        setLoading(false);
    }, []);

    const debouncedFetchLocations = useCallback(debounce(fetchLocations, 600), [fetchLocations]);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
        setLocationSelected(false);
        setLocalError("");
        debouncedFetchLocations(inputValue);
    };

    const handleSelectLocation = (location) => {
        setQuery(location.display_name);
        setSuggestions([]);
        setLocationSelected(true);
        setNoDataFound(false);
        setLocalError("");

        setFormData({
            ...formData,
            location: {
                place_id: location?.place_id || "",
                full_location: location?.display_name || "",
                latitude: location?.latitude || "",
                longitude: location?.longitude || "",
                location_name: location?.address?.name || "",
                country: location?.address?.country || "",
            },
        });
    };

    const handleBlur = () => {
        if (!locationSelected) {
            setFormData({ ...formData, location: null });
            setLocalError("Please select a valid location from the list.");
        }
    };

    return (
        <div className="relative">
            <label htmlFor="location" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                <div className="flex items-center gap-2">
                    Location
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        : <TbInfoCircleFilled />
                        Select a nearby location if the shown one is incorrect.
                    </span>
                </div>
            </label>

            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-300">
                    <FaMapMarkerAlt size={20} />
                </span>
                <input
                    id="location"
                    type="text"
                    placeholder="Enter your location"
                    value={query}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`bg-white text-black dark:bg-zinc-900 dark:text-white w-full pl-10 px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 ${localError || errors || noDataFound
                            ? "ring-2 ring-red-500"
                            : "focus:ring-2 focus:ring-green-500"
                        } transition duration-500 ease-in-out`}
                />
            </div>

            {(localError || errors) && (
                <p className="text-red-500 text-sm mt-2">{localError || errors}</p>
            )}

            {/* Loading Spinner */}
            {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <span className="w-4 h-4 border-2 border-gray-300  border-t-green-500 rounded-full animate-spin"></span>
                    Fetching locations...
                </div>
            )}

            {/* No Data Found */}
            {!loading && noDataFound && (
                <p className="text-red-500 text-sm mt-2">No data found. Try again.</p>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <ul className="absolute w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg mt-2 shadow-lg z-10">
                    {suggestions.map((location) => (
                        <li
                            key={location.place_id}
                            className="px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer transition-colors"
                            onClick={() => handleSelectLocation(location)}
                        >
                            {location.display_name || location.address?.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>

    );
};

export default UserLocation;
