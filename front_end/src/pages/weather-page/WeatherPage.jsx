import React, { useEffect, useState } from 'react';
import {
    FaCloudSun, FaTemperatureHigh, FaWind, FaInfoCircle, FaSun,
    FaMoon, FaCloud, FaCompass, FaEye, FaTachometerAlt
} from 'react-icons/fa';
import { WiHumidity } from 'react-icons/wi';
import axios from 'axios';
import { useSelector } from 'react-redux';
import WeatherPageShimmer from '../../components/shimmer-ui-component/WeatherPageShimmer';
import WeatherDataNotFoundImage from "../../assets/images/no-weather-data-found.png"

const WeatherPage = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = useSelector((state) => state.user.user);
    const latitude = user?.address?.latitude;
    const longitude = user?.address?.longitude;

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    useEffect(() => {
        if (!user?.address?.latitude || !user?.address?.longitude) return;

        const fetchWeather = async () => {

            try {


                const res = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                );

                setWeatherData(res.data);
            } catch (err) {
                // console.error("Weather fetch failed:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [user]);

    const formatTime = (timestamp) =>
        new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

    return (
        <div className="container mx-auto py-4 max-w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-400 p-4 text-white rounded-t-lg">
                <h1 className="text-xl font-bold">Weather Overview</h1>
            </div>

            {/* Container */}
            <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow-sm p-6 mb-8">
                {/* Info Alert */}
                <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6 dark:bg-yellow-950 dark:border-yellow-600">
                    <div className="flex">
                        <FaInfoCircle className="text-yellow-700 dark:text-yellow-400 mr-3 mt-1" />
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                                Weather at your farming location
                            </p>
                            <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">
                                Use this data to plan agricultural activities better and smarter.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Weather Card */}
                <div className="mb-2">
                    {loading ? (
                        <WeatherPageShimmer />
                    ) : weatherData ? (
                        <div className="text-green-800 dark:text-green-200 space-y-6 ">
                            {/* Title Section */}
                            <div className="flex items-center space-x-4 border  p-4 rounded-lg shadow-md dark:border-zinc-600 dark:bg-zinc-900">
                                <FaCloudSun className="text-4xl text-yellow-400" />
                                <div>
                                    <h3 className="text-lg font-semibold capitalize">{weatherData.weather[0].description}</h3>
                                    <p className="text-sm">{weatherData.name}</p>
                                </div>
                            </div>

                            {/* Grouped Boxes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {/* Temperature Box */}
                                <div className="border rounded-lg p-4 shadow-md dark:bg-zinc-900 dark:border-zinc-600 ">
                                    <h4 className="font-semibold mb-4  text-green-600 dark:text-green-300 border-b pb-2 dark:border-zinc-600">Temperature</h4>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <FaTemperatureHigh className="text-base" />
                                                <span>Current:</span>
                                            </div>
                                            <span className="font-semibold">{Math.round(weatherData.main.temp)}°C</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <FaTemperatureHigh className="text-base" />
                                                <span>Feels Like:</span>
                                            </div>
                                            <span className="font-semibold">{Math.round(weatherData.main.feels_like)}°C</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <FaTemperatureHigh className="text-base" />
                                                <span>Min/Max:</span>
                                            </div>
                                            <span className="font-semibold">
                                                {Math.round(weatherData.main.temp_min)}° / {Math.round(weatherData.main.temp_max)}°C
                                            </span>
                                        </div>
                                    </div>
                                </div>


                                {/* Atmospheric Conditions */}
                                <div className="border rounded-lg p-4 shadow-md dark:bg-zinc-900 dark:border-zinc-600">
                                    <h4 className="font-semibold mb-4 text-green-600 dark:text-green-300 border-b pb-2 dark:border-zinc-600">Atmosphere</h4>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <WiHumidity className="text-lg" />
                                                <span>Humidity:</span>
                                            </div>
                                            <span className="font-semibold">{weatherData.main.humidity}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <FaTachometerAlt />
                                                <span>Pressure:</span>
                                            </div>
                                            <span className="font-semibold">{weatherData.main.pressure} hPa</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <FaCloud />
                                                <span>Cloudiness:</span>
                                            </div>
                                            <span className="font-semibold">{weatherData.clouds.all}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <FaEye />
                                                <span>Visibility:</span>
                                            </div>
                                            <span className="font-semibold">{weatherData.visibility / 1000} km</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Wind Data */}
                                <div className="border rounded-lg p-4 shadow-md dark:bg-zinc-900 dark:border-zinc-600">
                                    <h4 className="font-semibold mb-4 text-green-600 dark:text-green-300 border-b pb-2 dark:border-zinc-600">Wind</h4>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <FaWind />
                                                <span>Speed:</span>
                                            </div>
                                            <span className="font-semibold">{weatherData.wind.speed} km/h</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <FaCompass />
                                                <span>Direction:</span>
                                            </div>
                                            <span className="font-semibold">{weatherData.wind.deg}°</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sunlight */}
                                <div className="border rounded-lg p-4 shadow-md dark:bg-zinc-900 dark:border-zinc-600">
                                    <h4 className="font-semibold mb-4 text-green-600 dark:text-green-300 border-b pb-2 dark:border-zinc-600">Sunlight</h4>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <FaSun className="text-yellow-400" />
                                                <span>Sunrise:</span>
                                            </div>
                                            <span className="font-semibold">{formatTime(weatherData.sys.sunrise)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <FaMoon className="text-indigo-400" />
                                                <span>Sunset:</span>
                                            </div>
                                            <span className="font-semibold">{formatTime(weatherData.sys.sunset)}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="text-center border-2 border-dashed border-gray-300 text-gray-600 py-10 px-4 bg-gray-100 rounded-md dark:bg-zinc-900 dark:border-zinc-700 ">
                            <img
                                src={WeatherDataNotFoundImage}
                                alt="No Events"
                                className="mx-auto w-64 object-contain"
                            />
                            <p className="text-lg font-semibold dark:text-zinc-400">No Weather data found!</p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">Try to refresh the page.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeatherPage;

