import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/user-dash-board/Home'
import UserLayout from '../layout/UserLayout'
import ProfilePage from '../pages/user-dash-board/ProfilePage'
import CommunityPage from '../pages/user-dash-board/CommunityPage'

function UsersRoutes() {
  return (
    <Routes>
      {/* user dash board routes  */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/farmer-profile" element={<ProfilePage />} />
        <Route path="/farmer-community" element={<CommunityPage />} />
      </Route>

    </Routes>
  )
}

export default UsersRoutes

