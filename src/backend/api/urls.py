from django.urls import path, include
from rest_framework import routers
from .views import BrotherAPIViewSet, PositionAPIViewSet, CountryAPIViewSet

router = routers.DefaultRouter()
router.register(r'brothers', BrotherAPIViewSet)
router.register(r'positions', PositionAPIViewSet)
router.register(r'countries', CountryAPIViewSet)

urlpatterns = [
    path('v1/', include(router.urls)),
] 