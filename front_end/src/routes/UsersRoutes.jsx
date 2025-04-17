import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/user-dash-board/Home'
import UserLayout from '../layout/UserLayout'
import ProfilePage from '../pages/user-dash-board/ProfilePage'
// Layout for community pages
import CommunityLayout from '../layout/UserCommunityLayout';

// Community pages
import DiscoverCommunities from '../pages/community-user-side/DiscoverCommunities';
import MyCommunities from '../pages/community-user-side/MyCommunities';
import CreateCommunity from '../pages/community-user-side/CreateCommunity';
import PendingRequest from '../pages/community-user-side/pendingRequest';
import FarmerCommunityChat from '../pages/ChatPages/FarmerCommunityChat';

function UsersRoutes() {

  return (
    <Routes>
      {/* user dash board routes  */}
      <Route element={<UserLayout />}>
        {/* base path for user dash-board  */}
        <Route path="/" element={<Home />} />
        {/* Profile section routes of user  */}
        <Route path="/farmer-profile" element={<ProfilePage />} />
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
      </Route>
    </Routes>
  )
}

export default UsersRoutes

