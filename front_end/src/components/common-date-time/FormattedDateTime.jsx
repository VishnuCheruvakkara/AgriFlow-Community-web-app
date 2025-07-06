import React from "react";

export default function FormattedDateTime({ date }) {
  if (!date) return <span className="text-xs text-gray-400">Not available</span>;

  const dt = new Date(date);

  // Check if date is invalid (e.g., NaN or broken format)
  if (isNaN(dt.getTime())) {
    return <span className="text-xs text-gray-400">Not available</span>;
  }

  const dateString = dt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeString = dt
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return (
    <span className="text-xs text-gray-500 dark:text-gray-400">
      {dateString} at {timeString}
    </span>
  );
}
