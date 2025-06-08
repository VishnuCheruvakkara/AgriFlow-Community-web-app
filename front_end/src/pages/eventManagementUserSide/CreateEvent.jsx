import React, { useState } from 'react';
import CreateEventForm from '../../components/event-management-user-side/CreateEventForm';
import SelectCommunityCreateEvent from '../../components/event-management-user-side/SelectCommunityCreateEvent';

function CreateEvent() {
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community);
  };
  const handleBackToSelect = () => {
    setSelectedCommunity(null);
  };
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-800  dark:text-zinc-200 ">Create Event</h2>

      {!selectedCommunity ? (
        <SelectCommunityCreateEvent onCommunitySelect={handleCommunitySelect} />
      ) : (
        <CreateEventForm selectedCommunity={selectedCommunity} onBack={handleBackToSelect}/>
      )}
    </div >
  );
}

export default CreateEvent;