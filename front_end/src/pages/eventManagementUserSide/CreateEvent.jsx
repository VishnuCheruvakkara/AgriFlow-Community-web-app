import React, { useState } from 'react';
import CreateEventForm from '../../components/event-management-user-side/CreateEventForm';
import SelectCommunityCreateEvent from '../../components/event-management-user-side/SelectCommunityCreateEvent';

function CreateEvent() {

  return (
    <div>
      
      <SelectCommunityCreateEvent />

      <CreateEventForm />

    </div >
  );
}

export default CreateEvent;