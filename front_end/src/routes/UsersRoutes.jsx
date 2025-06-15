import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
//Base pages of the user side 
import Home from '../pages/user-dash-board/Home'
import ProfilePage from '../pages/user-dash-board/ProfilePage'
import UserProfileViewPage from '../pages/user-dash-board/UserProfileViewPage'

// Layout for community pages
import UserLayout from '../layout/UserLayout';
import CommunityLayout from '../layout/UserCommunityLayout';
import EventLayout from '../layout/CommunityEventLayout';
import UserConnectionLayout from '../layout/UserConnectionLayout'
import ProductManagementLayout from '../layout/ProductManagementLayout'

// Community pages
import DiscoverCommunities from '../pages/community-user-side/DiscoverCommunities';
import MyCommunities from '../pages/community-user-side/MyCommunities';
import CreateCommunity from '../pages/community-user-side/CreateCommunity';
import PendingRequest from '../pages/community-user-side/pendingRequest';
import FarmerCommunityChat from '../pages/ChatPages/FarmerCommunityChat';

//Event management pages 
import CreateEvent from '../pages/eventManagementUserSide/CreateEvent'
import EnrolledEvents from '../pages/eventManagementUserSide/EnrolledEvents'
import AllEvents from '../pages/eventManagementUserSide/AllEvents'
import CreatedEvents from '../pages/eventManagementUserSide/CreatedEvents'

//Connection management pages
import SuggestedFarmers from '../pages/connection-management-user-side/SuggestedFarmers'
import PendingRequests from '../pages/connection-management-user-side/PendingRequests'
import MyConnections from '../pages/connection-management-user-side/MyConnections'
import BlockedUsers from '../pages/connection-management-user-side/BlockedUsers'

//Product management pages 
import AvailableProducts from '../pages/product-management-pages/AvailableProducts'
import ProductDeals from '../pages/product-management-pages/ProductDeals'
import MyProducts from '../pages/product-management-pages/MyProducts'
import WishList from '../pages/product-management-pages/WishList'

// famre to farmer chat pages 
import FarmerSingleChat from '../pages/ChatPages/FarmerSingleChat'

//farmer product dealing chat 
import FarmerProductChat from '../pages/ChatPages/FarmerProductChat'

// Importing PageNotFound component for 404
import PageNotFound from '../components/StatusPages/PageNotFound';

function UsersRoutes() {

  return (
    <Routes>
      {/* user dash board routes  */}
      <Route element={<UserLayout />}>
        {/* base path for user dash-board  */}
        <Route path="/" element={<Home />} />
        {/* Profile section routes of user  */}
        <Route path="/farmer-profile" element={<ProfilePage />} />
        {/* ProfilePage section where user can see and edit thier data  */}
        <Route path="/user-profile-view/:userId" element={<UserProfileViewPage />} />

        {/* Single to Single Chat Page set up */}
        <Route path="/farmer-single-chat/" element={<FarmerSingleChat />} />

        {/* Comunity set up */}
        <Route path="farmer-community" element={<CommunityLayout />}>
          <Route index element={<Navigate to="discover-communities" replace />} />
          <Route path="discover-communities" element={<DiscoverCommunities />} />
          <Route path="my-communities" element={<MyCommunities />} />
          <Route path="create-communities" element={<CreateCommunity />} />
          <Route path="pending-request" element={<PendingRequest />} />

          {/* Reusable chat route paths */}
          <Route path="my-communities/community-chat/:communityId" element={<FarmerCommunityChat />} />
          {/* <Route path="discover-communities/community-chat/:communityId" element={<FarmerCommunityChat />} />
          <Route path="community-chat/:communityId" element={<FarmerCommunityChat />} /> */}
        </Route>

        {/* Event management setup */}
        <Route path="event-management" element={<EventLayout />}>
          <Route index element={<Navigate to="all-events" replace />} />
          <Route path="all-events" element={<AllEvents />} />
          <Route path="enrolled-events" element={<EnrolledEvents />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="created-events" element={<CreatedEvents />} />
        </Route>

        {/* Connection management setup */}
        <Route path="connection-management" element={<UserConnectionLayout />}>
          <Route index element={<Navigate to="suggested-farmers" replace />} />
          <Route path="suggested-farmers" element={<SuggestedFarmers />} />
          <Route path="pending-requests" element={<PendingRequests />} />
          <Route path="my-connections" element={<MyConnections />} />
          <Route path="blocked-users" element={<BlockedUsers />} />
        </Route>

        {/* Product management layout section  */}
        <Route path="products" element={<ProductManagementLayout />}>
          <Route path="available-products" element={<AvailableProducts />} />
          <Route path="product-deals" element={<ProductDeals  />} />
          <Route path="my-products" element={<MyProducts />} />
          <Route path="wishlist" element={<WishList />} />
          <Route path="farmer-product-chat" element={< FarmerProductChat/>} />
        </Route>


      </Route>
      {/* Catch-all route for 404 Page */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default UsersRoutes

