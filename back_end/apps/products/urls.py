from django.urls import path 
from .views import CreateProductToSell,GetAllProductsAddedByCurrentUser,UpdateProductAPIView,SoftDeleteProductView
urlpatterns = [
    ###################### Create product to sell ##########################
    path("create-product-to-sell/",CreateProductToSell.as_view(),name="create-product-to-sell"),
    
    ###################### Get all the prducts in to front end ####################
    path('get-all-products/',GetAllProductsAddedByCurrentUser.as_view(),name="get-all-products"),

    ###################### Edit the product and update the changes #########################
    path('update-product/<int:pk>/', UpdateProductAPIView.as_view(), name='update-product'),
  
    ######################  Soft delete teh prodcuts ###########################
    path('soft-delete/<int:pk>/',SoftDeleteProductView.as_view(),name="soft-delete-prodcut")
]

