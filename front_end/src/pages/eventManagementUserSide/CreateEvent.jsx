import React, { useState } from 'react';
import DateTimePicker from '../../components/event-management-user-side/DateTimePicker';
import BannerImageUpload from '../../components/image-uploader/BannerImageUpload';

function CreateEvent() {
  const [eventType, setEventType] = useState('');
  //Set state for the date handling from the common component 
  const [startDate, setStartDate] = useState(null);

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value.toLowerCase());
  };

  return (
    <div className="max-w-full mx-auto px-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-green-600 mb-2">Create a New Event</h2>
        <p className="text-gray-600 text-sm">Share an amazing experience with your community</p>
      </div>

      {/* The BannerImageUpload component */}
      <div className="flex justify-center mb-6">
        <BannerImageUpload
          onImageSelect={(file, purpose) => {
            console.log("File uploaded:", file);
            console.log("Purpose:", purpose);
          }}
          purpose="eventBanner" // Use for event banners
        />
      </div>

      <form>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Give your event a catchy title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="4"
              className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe what your event is about"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={handleEventTypeChange}
                required
                value={eventType}
              >
                <option value="" disabled hidden>
                  -- Select event type --
                </option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>


            {/* Location for Offline Event */}
            {eventType === 'offline' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Where will it be held?"
                  />
                </div>

                {/* Make this span full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address</label>
                  <input
                    type="text"
                    className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Full address of the venue"
                  />
                </div>
              </>
            )}


            {/* Google Meet Link for Online Event */}
            {eventType === 'online' && (
              <div >
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Meet</label>
                <input
                  type="url"
                  className="bg-white text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter the online meeting link"
                />
              </div>
            )}
          </div>



          <DateTimePicker
            label="Start Date & Time"
            selected={startDate}
            onChange={setStartDate}
            required={true}
          />

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium text-lg transition duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
