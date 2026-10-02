from django.urls import path

from chat.views import webhook

urlpatterns = [
    path('webhook/', webhook),
]
