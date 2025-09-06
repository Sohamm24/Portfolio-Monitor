# portfolio/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet, AssetViewSet, dashboard_data, market_data

router = DefaultRouter()
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')
router.register(r'assets', AssetViewSet, basename='asset')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/dashboard/', dashboard_data, name='dashboard-data'),
    path('api/market/', market_data, name='market-data'),
    path('api/auth/', include('rest_framework.urls')),  # For browsable API login
]