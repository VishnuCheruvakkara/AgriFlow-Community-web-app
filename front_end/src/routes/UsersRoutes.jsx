import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
//Base pages of the user side 
import Home from '../pages/user-dash-board/Home'
import ProfilePage from '../pages/user-dash-board/ProfilePage'
import UserProfileViewPage from '../pages/user-dash-board/UserProfileViewPage'

// Layout for community pages
import UserLayout from '../layout/UserLayout';
import CommunityLayout from '../layout/UserCommunityLayout';
import EventLayout from '../layout/CommunityEventLayout';

// Community pages
import DiscoverCommunities from '../pages/community-user-side/DiscoverCommunities';
import MyCommunities from '../pages/community-user-side/MyCommunities';
import CreateCommunity from '../pages/community-user-side/CreateCommunity';
import PendingRequest from '../pages/community-user-side/pendingRequest';
import FarmerCommunityChat from '../pages/ChatPages/FarmerCommunityChat';

//Event management pages 
import CreateEvent from '../pages/eventManagementUserSide/CreateEvent'
import MyEvents from '../pages/eventManagementUserSide/MyEvents'
import AllEvents from '../pages/eventManagementUserSide/AllEvents'

// Importing PageNotFound component for 404
import PageNotFound from '../components/StatusPages/PageNotFound';


function UsersRoutes() {

  return (
    <Routes>
      {/* user dash board routes  */}
      <Route element={<UserLayout />}>
        {/* base path for user dash-board  */}
        <Route path="/" element={<Home />} />
        {/* Profile section routes of user  */}
        <Route path="/farmer-profile" element={<ProfilePage />} />
        {/* ProfilePage section where user can see and edit thier data  */}
        <Route path="/user-profile-view" element={<UserProfileViewPage />} />

        {/* Comunity set up */}
        <Route path="farmer-community" element={<CommunityLayout />}>
          <Route index element={<Navigate to="discover-communities" replace />} />
          <Route path="discover-communities" element={<DiscoverCommunities />} />
          <Route path="my-communities" element={<MyCommunities />} />
          <Route path="create-communities" element={<CreateCommunity />} />
          <Route path="pending-request" element={<PendingRequest />} />

          {/* Reusable chat route paths */}
          <Route path="my-communities/community-chat/:communityId" element={<FarmerCommunityChat />} />
          {/* <Route path="discover-communities/community-chat/:communityId" element={<FarmerCommunityChat />} />
          <Route path="community-chat/:communityId" element={<FarmerCommunityChat />} /> */}
        </Route>

        {/* Event management setup */}
        <Route path="event-management" element={<EventLayout />}>
          <Route index element={<Navigate to="all-events" replace />} />
          <Route path="all-events" element={<AllEvents />} />
          <Route path="my-events" element={<MyEvents />} />
          <Route path="create-event" element={<CreateEvent />} />
        </Route>

      </Route>
      {/* Catch-all route for 404 Page */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default UsersRoutes

