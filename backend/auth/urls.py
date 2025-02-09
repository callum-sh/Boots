from django.urls import path
from . import views

urlpatterns = [
     path('register/', views.RegisterUserView.as_view(), name ='register'),
     path('user/', views.CurrentUserView.as_view(), name ='user'),
     path('logout/', views.LogoutView.as_view(), name ='logout')
]