import React from 'react'
import { Routes, Route,Navigate } from 'react-router-dom'
import Home from '../pages/user-dash-board/Home'
import UserLayout from '../layout/UserLayout'
import ProfilePage from '../pages/user-dash-board/ProfilePage'
//Community layout 
import CommunityLayout from '../layout/UserCommunityLayout'
// Community sub-pages
import DiscoverCommunities from '../components/user-dash-board/createCommunitySupportComponents/DiscoverCommunities'
import MyCommunities from '../components/user-dash-board/createCommunitySupportComponents/MyCommunities'
import CreateCommunity from '../components/user-dash-board/createCommunitySupportComponents/CreateCommunity'
import PendingRequest from '../components/user-dash-board/createCommunitySupportComponents/pendingRequest'

function UsersRoutes() {
  return (
    <Routes>
      {/* user dash board routes  */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/farmer-profile" element={<ProfilePage />} />

        <Route path="farmer-community" element={<CommunityLayout />}>
          <Route index element={<Navigate to="discover-communities" replace />} />
          <Route path="discover-communities" element={<DiscoverCommunities />} />
          <Route path="my-communities" element={<MyCommunities />} />
          <Route path="create-communities" element={<CreateCommunity />} />
          <Route path="pending-request" element={<PendingRequest/>} />
        </Route>

      </Route>
    </Routes>
  )
}

export default UsersRoutes

