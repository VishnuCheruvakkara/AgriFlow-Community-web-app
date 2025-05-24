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
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
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
          className={`w-full px-4 py-3 rounded-lg focus:outline-none 
            ${showError ? 'ring-2 ring-red-500 border-none' : ' focus:ring-2 focus:ring-green-500'}
            bg-white text-black border
            dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:placeholder-zinc-400`}
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
