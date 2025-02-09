from rest_framework.routers import DefaultRouter
from django.urls import path

from competitions.views import *

router = DefaultRouter()
router.register(r'category', CategoryViewSet, basename='category')
router.register(r'competition', CompetitionViewSet, basename='competition')
router.register(r'participant', ParticipantViewSet, basename='participant')
router.register(r'goal', GoalViewSet, basename='goal')
router.register(r'invites', InviteViewSet, basename='invite')

urlpatterns = router.urls

# add custom function urls 
urlpatterns += [
    path('competition/<int:pk>/join/', join_competition),
]