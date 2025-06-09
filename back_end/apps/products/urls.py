from django.urls import path 
from .views import CreateProductToSell
urlpatterns = [
  
    path("create-product-to-sell",CreateProductToSell.as_view(),name="create-product-to-sell"),
  
]

