from django.urls import path
from .views import (
    CreateProductToSell,
    GetAllProductsAddedByCurrentUser,
    UpdateProductAPIView,
    SoftDeleteProductView,
    GetAllAvailableProducts,
    ProductDealMessageListView,
    GetSingleProductDetailsView,
    SellingProductDealsAPIView,
    BuyingDealsView,
    ToggleWishlistAPIView,
    WishlistListAPIView,
    GetMyWishlistProductsAPIView,
    ToggleProductAvailabilityView,
    GetAllProductsAdminSideView,
    GetSingleProductAdminSideView,
    ToggleProductDeleteStatusView
)

urlpatterns = [
    # Product management
    path("create-product-to-sell/", CreateProductToSell.as_view(), name="create-product-to-sell"),
    path('get-all-products/', GetAllProductsAddedByCurrentUser.as_view(), name="get-all-products"),
    path('update-product/<int:pk>/', UpdateProductAPIView.as_view(), name='update-product'),
    path('soft-delete/<int:pk>/', SoftDeleteProductView.as_view(), name="soft-delete-prodcut"),
    path('get-all-available-products/', GetAllAvailableProducts.as_view(), name='available-products'),
    path('get-single-product-details/<int:product_id>/', GetSingleProductDetailsView.as_view(), name='get-single-product-details'),
    path("toggle-product-state/<int:pk>/", ToggleProductAvailabilityView.as_view(), name="toggle-product-state"),

    # Deal messages and tracking
    path('get-product-deal-messages/', ProductDealMessageListView.as_view(), name='get-product-deal-messages'),
    path('get-selling-product-deals/', SellingProductDealsAPIView.as_view(), name='selling-deals'),
    path('buying-product-deals/', BuyingDealsView.as_view(), name='buying-deals'),

    # Wishlist
    path('wishlist/toggle-status/', ToggleWishlistAPIView.as_view(), name='toggle-wishlist'),
    path('wishlist/my-products/', WishlistListAPIView.as_view(), name='wishlist-products'),
    path('wishlist/my-wish-list-items/', GetMyWishlistProductsAPIView.as_view(), name='my-wishlist-products'),

    # Admin-side product management
    path("admin/get-all-product/", GetAllProductsAdminSideView.as_view(), name="get-all-products-admin-side"),
    path("admin/get-single-product/<int:product_id>/", GetSingleProductAdminSideView.as_view(), name="get-single-product"),
    path("admin/toggle-delete-status/<int:pk>/", ToggleProductDeleteStatusView.as_view(), name="toggle_product_delete_status"),
]
