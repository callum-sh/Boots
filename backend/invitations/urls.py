from rest_framework.routers import DefaultRouter

from invitations.views import *

router = DefaultRouter()
router.register(r'invite', InviteViewSet, basename='invite')


urlpatterns = router.urls