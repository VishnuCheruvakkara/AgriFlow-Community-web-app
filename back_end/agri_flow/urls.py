
from django.contrib import admin
from django.urls import path,include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('apps.Home.urls')),
    path('users/',include('apps.users.urls')),
    path('community/',include('apps.community.urls')),
    path('events/',include('apps.events.urls')),
    path('connections/',include('apps.connections.urls')),
    path('notifications/',include('apps.notifications.urls')),
    path('products/',include('apps.products.urls')),
    path('posts/',include('apps.posts.urls')),
    path('dash-board/',include('apps.dash_board.urls')),

]


