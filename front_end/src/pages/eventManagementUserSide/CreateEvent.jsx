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
      {!selectedCommunity ? (
        <SelectCommunityCreateEvent onCommunitySelect={handleCommunitySelect} />
      ) : (
        <CreateEventForm selectedCommunity={selectedCommunity} onBack={handleBackToSelect}/>
      )}
    </div >
  );
}

export default CreateEvent;