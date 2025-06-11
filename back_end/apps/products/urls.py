from django.urls import path 
from .views import CreateProductToSell,GetAllProductsAddedByCurrentUser
urlpatterns = [
    ###################### Create product to sell ##########################
    path("create-product-to-sell/",CreateProductToSell.as_view(),name="create-product-to-sell"),
    
    ###################### Get all the prducts in to front end ####################
    path('get-all-products/',GetAllProductsAddedByCurrentUser.as_view(),name="get-all-products")
  
]

