// MyEvents.jsx
import React from 'react';

function MyEvents() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-700">My Participated Events</h2>
      <p className="text-gray-600">Events you've RSVP'd to will appear here.</p>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <p className="text-gray-500">You haven’t joined any events yet.</p>
      </div>
    </div>
  );
}

export default MyEvents;
