// components/DateTimePicker.jsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker = ({ label, selected, onChange, required = false }) => {
    return (
        <div >
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <DatePicker
                selected={selected}
                onChange={onChange}
                showTimeSelect
                timeFormat="hh:mm aa" 
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
                className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required={required}
                wrapperClassName="w-full"
            />
        </div>
    );
};

export default DateTimePicker;
