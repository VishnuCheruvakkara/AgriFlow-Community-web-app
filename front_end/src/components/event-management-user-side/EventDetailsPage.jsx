import React from "react" 

function EventDetailsPage({ event }) {
  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-4">{event.title}</h2>
      <img
        src={event.banner_url || DeafultBannerImage}
        alt="Event Banner"
        className="w-full h-60 object-cover rounded-md mb-4"
      />
      <p className="text-gray-600 mb-2"><strong>Community:</strong> {event.community_name}</p>
      <p className="text-gray-600 mb-2"><strong>Type:</strong> {event.event_type}</p>
      <p className="text-gray-600 mb-2"><strong>Location:</strong> {event.location_name || 'Online Event'}</p>
      <p className="text-gray-600 mb-2"><strong>Start:</strong> {new Date(event.start_datetime).toLocaleString()}</p>
      <p className="text-gray-600"><strong>Description:</strong> {event.description}</p>
    </div>
  );
}

export default EventDetailsPage;
