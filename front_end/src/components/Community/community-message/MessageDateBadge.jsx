import React from 'react';

const DateBadge = ({ date }) => {
  // Helper function to get label for badge
  function getDateLabel(date) {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayMidnight = new Date(todayMidnight);
    yesterdayMidnight.setDate(todayMidnight.getDate() - 1);

    if (date.getTime() === todayMidnight.getTime()) return "Today";
    if (date.getTime() === yesterdayMidnight.getTime()) return "Yesterday";

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="flex justify-center mb-4">
      <span className="bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200 text-xs px-3 py-1 rounded-full">
        {getDateLabel(date)}
      </span>
    </div>
  );
};

export default DateBadge;
