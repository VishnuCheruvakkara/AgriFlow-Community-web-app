
import React from 'react'
import { Routes, Route } from "react-router-dom"
import AuthenticationRoutes from './AuthenticationRoutes'
import UsersRoutes from './UsersRoutes'
import AdminRoutes from './AdminRoutes'
// importing the protected routes 
import AdminProtectedRoute from './RoutesProtection/AdminProtectedRoute'
import UserProtectedRoute from './RoutesProtection/UserProtectedRoute'

function RoutesConfig() {
    return (
        <div>
            <Routes>

                {/* Authentication Routes */}
                <Route path="/*" element={<AuthenticationRoutes />} />

                {/* User Dashboard Routes */}
                <Route path="/user-dash-board/*" element={<UserProtectedRoute />} >
                    <Route path="*" element={<UsersRoutes />} />
                </Route>

                {/* Admin Dashboard  */}
                <Route path="/admin/*" element={<AdminProtectedRoute />}>
                    <Route path="*" element={<AdminRoutes />} />
                </Route>

            </Routes>
        </div >
    )
}

export default RoutesConfig
