import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../layout/AdminLayout'
import DashboardPage from '../pages/admin-dash-board/DashboardPage'
import UsersPage from '../pages/admin-dash-board/UserPage'
import OrdersPage from '../pages/admin-dash-board/Orderspage'

function AdminRoutes() {
    return (
        <Routes>
            {/* Admin dash board */}

            <Route element={<AdminLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="orders" element={<OrdersPage />} />
            </Route>

        </Routes>
    )
}

export default AdminRoutes
