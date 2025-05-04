// CreateEvent.jsx
import React from 'react';

function CreateEvent() {
  return (
    <div className="max-w-full mx-auto  px-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-green-600 mb-2">Create a New Event</h2>
        <p className="text-gray-600 text-sm">Share an amazing experience with your community</p>
      </div>

      <form>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
              placeholder="Give your event a catchy title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="4"
              className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
              placeholder="Describe what your event is about"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out cursor-pointer"
              >
                <option value="">Select event type</option>
                <option>Online</option>
                <option>Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
                placeholder="Where will it be held?"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
              className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
               
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
              <input
                type="datetime-local"
              className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-500 ease-in-out"
                
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium text-lg transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;