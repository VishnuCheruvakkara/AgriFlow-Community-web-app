import React from 'react';
import DatePicker from 'react-datepicker';
import { motion } from 'framer-motion';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker = ({
  label,
  selected,
  onChange,
  required = false,
  error = null,
  touched = false,
  shake = false,
}) => {
  const showError = error && touched;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <motion.div
        variants={{
          shake: {
            x: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.4 },
          },
        }}
        animate={showError && shake ? 'shake' : ''}
      >
        <DatePicker
          selected={selected}
          onChange={onChange}
          showTimeSelect
          timeFormat="hh:mm aa"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Select date and time"
          className={`bg-white text-black w-full px-4 py-3 border rounded-lg focus:outline-none 
            ${showError ? 'ring-2 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
          required={required}
          minDate={new Date()}
          wrapperClassName="w-full"
        />
      </motion.div>

      {showError && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default DateTimePicker;
