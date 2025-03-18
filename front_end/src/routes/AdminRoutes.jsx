import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../layout/AdminLayout'
import DashboardPage from '../pages/admin-dash-board/DashboardPage'
import UsersPage from '../pages/admin-dash-board/UserPage'
import ProductsPage from '../pages/admin-dash-board/ProductsPage'

function AdminRoutes() {
    return (
        <Routes>
            {/* Admin dash board */}

            <Route element={<AdminLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/users-management" element={<UsersPage />} />
                <Route path="/products-management" element={<ProductsPage />} />
            </Route>

        </Routes>
    )
}

export default AdminRoutes
