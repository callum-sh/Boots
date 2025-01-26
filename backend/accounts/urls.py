from django.urls import path
from . import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name ='login'),
    path('register/', views.RegisterView.as_view(), name ='register'),
    path('fetch_user/', views.FetchAuthenticatedUserView.as_view(), name ='fetch_user'),
    path('logout/', views.LogoutView.as_view(), name ='logout'),
]