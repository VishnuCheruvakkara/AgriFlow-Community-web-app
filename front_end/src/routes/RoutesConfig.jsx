
import React from 'react'
import { Routes, Route } from "react-router-dom"
import AuthenticationRoutes from './AuthenticationRoutes'
import UsersRoutes from './UsersRoutes'

function RoutesConfig() {
    return (
        <div>
            <Routes>
                {/* Authentication Routes */}
                <Route path="/*" element={<AuthenticationRoutes />} />

                {/* User Dashboard Routes */}
                <Route path="/user-dash-board/*" element={<UsersRoutes />} />
            </Routes>
        </div>
    )
}

export default RoutesConfig
