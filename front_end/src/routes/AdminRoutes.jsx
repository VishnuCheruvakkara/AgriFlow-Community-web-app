import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../layout/AdminLayout'
import DashboardPage from '../pages/admin-dash-board/DashboardPage'
import UsersPage from '../pages/admin-dash-board/UserPage'
import ProductsPage from '../pages/admin-dash-board/ProductsPage'
import UserPageDetailView from '../pages/admin-dash-board/UserPageDetailView'
import PageNotFound from '../components/StatusPages/PageNotFound'

function AdminRoutes() {
    return (
        <Routes>
            {/* Wrap all admin views in your layout */}
            <Route element={<AdminLayout />}>
                {/* Dashboard at /admin/ */}
                <Route index element={<DashboardPage />} />

                {/* Users management at /admin/users-management */}
                <Route path="users-management" element={<UsersPage />} />

                {/* Products management at /admin/products-management */}
                <Route path="products-management" element={<ProductsPage />} />

                {/* Detail view at /admin/users-management/user-details/:userId */}
                <Route
                    path="users-management/user-details/:userId"
                    element={<UserPageDetailView />}
                />

            </Route>
            {/* ← This will catch any other /admin/... URL */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default AdminRoutes
