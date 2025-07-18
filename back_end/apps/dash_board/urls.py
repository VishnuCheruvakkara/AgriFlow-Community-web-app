from django.urls import path
from dash_board.views import GetDashBoardDataView

urlpatterns = [
    path('get-dash-board-data/', GetDashBoardDataView.as_view(), name='get-dash-board-data'),
]