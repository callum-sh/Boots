from rest_framework.routers import DefaultRouter

from competitions.views import *

router = DefaultRouter()
router.register(r'category', CategoryViewSet, basename='category')
router.register(r'competition', CompetitionViewSet, basename='competition')
router.register(r'participant', ParticipantViewSet, basename='participant')
router.register(r'goal', GoalViewSet, basename='goal')

urlpatterns = router.urls