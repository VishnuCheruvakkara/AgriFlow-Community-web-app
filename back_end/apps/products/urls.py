from django.urls import path 
from .views import CreateProductToSell,GetAllProductsAddedByCurrentUser,UpdateProductAPIView,SoftDeleteProductView,GetAllAvailableProducts,ProductDealMessageListView,GetSingleProductDetailsView,SellingProductDealsAPIView,BuyingDealsView,ToggleWishlistAPIView,WishlistListAPIView,GetMyWishlistProductsAPIView,ToggleProductAvailabilityView
urlpatterns = [
    ###################### Create product to sell ##########################
    path("create-product-to-sell/",CreateProductToSell.as_view(),name="create-product-to-sell"),
    
    ###################### Get all the prducts in to front end ####################
    path('get-all-products/',GetAllProductsAddedByCurrentUser.as_view(),name="get-all-products"),

    ###################### Edit the product and update the changes #########################
    path('update-product/<int:pk>/', UpdateProductAPIView.as_view(), name='update-product'),
  
    ######################  Soft delete teh prodcuts ###########################
    path('soft-delete/<int:pk>/',SoftDeleteProductView.as_view(),name="soft-delete-prodcut"),

    ##################### Get all the availabel products ##############################
    path('get-all-available-products/', GetAllAvailableProducts.as_view(), name='available-products'),

    ##################### Get all product messages based on user and product data ##################
    path('get-product-deal-messages/', ProductDealMessageListView.as_view(), name='get-product-deal-messages'),

    ################### Get the selected product details #######################
    path('get-single-product-details/<int:product_id>/', GetSingleProductDetailsView.as_view(), name='get-single-product-details'),

    ################# Get Selling product deals by the current user  ########################33
    path('get-selling-product-deals/', SellingProductDealsAPIView.as_view(), name='selling-deals'),

    ################# Get Buying product deals by the current user #####################
    path('buying-product-deals/', BuyingDealsView.as_view(), name='buying-deals'), 

    ################# Toggle the is_available of a product ######################
    path("toggle-product-state/<int:pk>/",ToggleProductAvailabilityView.as_view(),name="toggle-product-state"),

    ################# Wish list ########################

    #===========================  Toggle wishlist (Add or remove product fromt eh wish list ) ==================================#
    path('wishlist/toggle-status/', ToggleWishlistAPIView.as_view(), name='toggle-wishlist'),

    #========================== Get the products from wish list =============================#
    path('wishlist/my-products/', WishlistListAPIView.as_view(), name='wishlist-products'),

    #======================= Get the products that added in the wishlist by the current/logged in user =======================# 
    path('wishlist/my-wish-list-items/', GetMyWishlistProductsAPIView.as_view(), name='my-wishlist-products'),
]

