from django.urls import path
from . import views

urlpatterns = [
     path('register/', views.RegisterUserView.as_view(), name ='register'),
     path('logout/', views.LogoutView.as_view(), name ='logout'),
     path('user/', views.UserView.as_view(), name ='user'),
]