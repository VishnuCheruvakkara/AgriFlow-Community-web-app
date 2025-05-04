// AllEvents.jsx
import React from 'react';

function AllEvents() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-700">All Community Events</h2>
      <p className="text-gray-600">Browse and RSVP to events hosted by different communities.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((event, index) => (
          <div key={index} className="bg-white shadow p-4 rounded-lg border hover:shadow-md transition">
            <h3 className="text-xl font-bold text-green-700">Event Title {index + 1}</h3>
            <p className="text-gray-500 text-sm">Hosted by: Some Community</p>
            <p className="mt-2 text-gray-700">This is a brief description of the event. More details can be added later.</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllEvents;
