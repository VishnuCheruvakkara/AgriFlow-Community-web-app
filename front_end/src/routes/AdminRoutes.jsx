import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../layout/AdminLayout'
import DashboardPage from '../pages/admin-dash-board/DashboardPage'
import UsersPage from '../pages/admin-dash-board/UserPage'
import ProductsPage from '../pages/admin-dash-board/ProductsPage'
import UserPageDetailView from '../pages/admin-dash-board/UserPageDetailView'
import PageNotFound from '../components/StatusPages/PageNotFound'
import AdminProductDetailsPage from '../pages/admin-dash-board/ProductDetailsPage'
import CommunityPage from '../pages/admin-dash-board/CommunityPage'
import EventManagementPage from '../pages/admin-dash-board/EventPage'
import PostPage from '../pages/admin-dash-board/PostPage'
import CommunityDetailsPage from '../pages/admin-dash-board/CommunityDetailsPage'
import EventDetailsPage from '../pages/admin-dash-board/EventDetailsPage'
import PostDetailsPage from '../pages/admin-dash-board/PostDetailsPage'

function AdminRoutes() {
    return (
        <Routes>
            {/* Wrap all admin views in your layout */}
            <Route element={<AdminLayout />}>
                {/* Dashboard at /admin/ */}
                <Route index element={<DashboardPage />} />

                {/* ================= Admin side user mangement Routes ==================== */}
                {/* Users management at /admin/users-management */}
                <Route path="users-management" element={<UsersPage />} />
                {/* Detail view at /admin/users-management/user-details/:userId */}
                <Route path="users-management/user-details/:userId" element={<UserPageDetailView />} />

                {/* ====================== Admin side product management  ==================== */}
                {/* Products management at /admin/products-management */}
                <Route path="products-management" element={<ProductsPage />} />
                {/* Product Details view in the admin side  */}
                <Route path="products-management/product-details/:productId" element={< AdminProductDetailsPage/>} />

                {/*==================  Admin side community management  =========================*/}
                <Route path="community-management" element={<CommunityPage />} />
                <Route path="community-management/community-details/:communityId" element={<CommunityDetailsPage />} />
                

                
                {/*======================== Admin side Event management  ================================*/}
                <Route path="event-management" element={<EventManagementPage />} />
                <Route path="event-management/event-details/:eventId" element={<EventDetailsPage/>} />


                {/*======================== Admin side post management =============================*/}\
                <Route path="post-management" element={ <PostPage/>} />
                <Route path="post-management/post-details/:postId" element={ <PostDetailsPage/>} />
                
                
            </Route>
            {/*  This will catch any other /admin/... URL */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default AdminRoutes
