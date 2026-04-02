from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('shipments', views.ShipmentViewSet, basename='shipment')
router.register('carriers', views.CarrierViewSet, basename='carrier')
router.register('vehicles', views.VehicleViewSet, basename='vehicle')
router.register('users', views.UserViewSet, basename='user')
router.register('audit-logs', views.AuditLogViewSet, basename='auditlog')
router.register('carbon-projects', views.CarbonProjectViewSet, basename='carbonproject')

urlpatterns = [
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('track/', views.TrackShipmentView.as_view(), name='track'),
    path('orders/', views.OrderListView.as_view(), name='orders'),
    path('', include(router.urls)),
]
