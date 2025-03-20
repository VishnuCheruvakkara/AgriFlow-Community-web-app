import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/user-dash-board/Home'
import UserLayout from '../layout/UserLayout'
import ProfilePage from '../pages/user-dash-board/ProfilePage'

function UsersRoutes() {
  return (
    <Routes>
      {/* user dash board routes  */}

      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/farmer-profile" element={<ProfilePage />} />

      </Route>

    </Routes>
  )
}

export default UsersRoutes

