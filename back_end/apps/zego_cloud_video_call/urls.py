
from django.urls import path
from .views import GenerateAndGetZegoToken

urlpatterns = [
    ####################### generate zego token view ################################3
    path("generate_zego_token/", GenerateAndGetZegoToken.as_view(), name="generate-zego-token"),


    
]
