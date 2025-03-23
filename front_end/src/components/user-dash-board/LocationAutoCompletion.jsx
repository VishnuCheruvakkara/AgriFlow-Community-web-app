import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import AuthenticatedAxiosInstance from '../../axios-center/AuthenticatedAxiosInstance';

const LocationAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Your village or city",
  label = "Village/City Name"
}) => {
  const wrapperRef = useRef(null);
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await AuthenticatedAxiosInstance.get("/users/location-autocomplete/", { 
          params: { q: query } 
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
      setLoading(false);
    };

    // Debounce API calls (wait 500ms after user stops typing)
    const timer = setTimeout(fetchLocations, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle clicks outside the component to hide suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  // Handle selection of a suggestion
  const handleSuggestionClick = (selectedItem) => {
    setQuery(selectedItem.display_name);
    setShowSuggestions(false);
    // Pass the selected location data back to parent component
    if (onChange) {
      onChange(selectedItem);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Pass the input value back to parent component
    if (onChange) {
      onChange({ display_name: value });
    }
  };

  // Show suggestions when input is focused
  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-gray-700 mb-2" htmlFor="location-name">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id="location-name"
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          autoComplete='new-password'
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      </div>

      {loading && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching locations...
        </div>
      )}

      {suggestions.length > 0 && showSuggestions && (
        <div className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
          <ul className="py-2">
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors flex items-start"
                onClick={() => handleSuggestionClick(item)}
              >
                <div className="text-green-600 mr-2 mt-1 flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-800">{item.display_name.split(',')[0]}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">
                    {item.display_name.split(',').slice(1).join(',')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;