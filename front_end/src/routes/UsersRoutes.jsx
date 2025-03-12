import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/user-dash-board/Home'
import UserLayout from '../layout/UserLayout'

function UsersRoutes() {
  return (
    <Routes>
      {/* user dash board routes  */}

      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

    </Routes>
  )
}

export default UsersRoutes


