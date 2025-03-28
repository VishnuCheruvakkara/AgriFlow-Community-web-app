import React, { useState, useCallback } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { debounce } from "lodash"; // Import debounce from Lodash
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import { TbInfoCircleFilled } from "react-icons/tb";

const UserLocation = ({formData,setFormData,errors}) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to fetch locations (debounced)
    const fetchLocations = useCallback(async (searchQuery) => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            return;
        }
    
        setLoading(true);
        try {
            const response = await AuthenticatedAxiosInstance.get(`/users/location-autocomplete/?q=${searchQuery}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
        setLoading(false);
    }, []);

    // Debounce the API call
    const debouncedFetchLocations = useCallback(debounce(fetchLocations, 600), [fetchLocations]);

    // Handle input change
    const handleChange = (e) => {
        setQuery(e.target.value);
        debouncedFetchLocations(e.target.value);
    };

    // Handle selection of location
    const handleSelectLocation = (location) => {
        setQuery(location.display_name); // Set selected location in input
        setSuggestions([]); // Hide suggestions

        // Store selected location in parent form state
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

    return (
        <div className="relative">
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Location
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <FaMapMarkerAlt size={20}/>
                </span>
                <input
                    id="location"
                    type="text"
                    placeholder="Enter your location"
                    value={query}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

            </div>
            {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <TbInfoCircleFilled />
                Select a nearby location if the shown one is incorrect.
            </p>


            {loading && <p className="text-gray-500 text-sm mt-2">Fetching locations...</p>}

            {suggestions.length > 0 && (
                <ul className="absolute w-full text-gray-700 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10">
                    {suggestions.map((location) => (
                        <li
                            key={location.place_id}
                            className="px-4 py-2 hover:bg-green-100 cursor-pointer transition-colors"
                            onClick={() => handleSelectLocation(location)}
                        >
                            {location.display_name ||location.address.name}

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserLocation;
