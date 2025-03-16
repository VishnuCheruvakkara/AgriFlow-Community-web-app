
import React from 'react'
import { Routes, Route } from "react-router-dom"
import AuthenticationRoutes from './AuthenticationRoutes'
import UsersRoutes from './UsersRoutes'
import AdminRoutes from './AdminRoutes'

function RoutesConfig() {
    return (
        <div>
            <Routes>
                {/* Authentication Routes */}
                <Route path="/*" element={<AuthenticationRoutes />} />

                {/* User Dashboard Routes */}
                <Route path="/user-dash-board/*" element={<UsersRoutes />} />

                {/* Admin Dashboard  */}
                <Route path="/admin-dash-board/*" element={ <AdminRoutes/>} />
            </Routes>
        </div>
    )
}

export default RoutesConfig
