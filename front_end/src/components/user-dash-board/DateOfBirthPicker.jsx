import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { format, parseISO } from "date-fns"; // Import date-fns for formatting

const DateOfBirthPicker = ({ formData, setFormData, errors }) => {
    const handleDateChange = (date) => {
        if (date) {
            // Convert to yyyy-mm-dd for storage
            const formattedStorageDate = format(date, "yyyy-MM-dd");
            // Update parent form state
            setFormData({ ...formData, date_of_birth: formattedStorageDate })
        }
    };

    return (
        <div className="w-full">
            <label htmlFor="dob" className="block text-gray-700 dark:text-zinc-200 font-medium mb-2">
                Date of Birth
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-400 z-10">
                    <FaCalendarAlt size={20} />
                </span>
                <DatePicker
                    selected={formData.date_of_birth ? parseISO(formData.date_of_birth) : null}
                    onChange={handleDateChange}
                    id="dob"
                    dateFormat="dd-MM-yyyy" // Display format for the user
                    placeholderText="Select date of birth"
                    className={`bg-white dark:bg-zinc-900 text-black dark:text-white w-full pl-10 px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 ${errors ? "focus:ring-red-500" : "focus:ring-green-500"
                        } transition duration-500 ease-in-out`}
                    wrapperClassName="w-full"
                />
            </div>
            {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}
        </div>

    );
};

export default DateOfBirthPicker;
