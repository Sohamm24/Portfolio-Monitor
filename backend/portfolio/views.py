# portfolio/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Sum
from .models import Portfolio, Asset, RiskMetrics
from .serializers import (
    PortfolioSerializer, 
    PortfolioCreateSerializer, 
    AssetSerializer,
    RiskMetricsSerializer
)
import random

class PortfolioViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PortfolioCreateSerializer
        return PortfolioSerializer
    
    @action(detail=True, methods=['get'])
    def risk_analysis(self, request, pk=None):
        """Get detailed risk analysis for a portfolio"""
        portfolio = self.get_object()
        
        # Calculate some mock risk metrics
        total_assets = portfolio.assets.count()
        risk_data = {
            'portfolio_id': portfolio.id,
            'risk_score': portfolio.risk_score,
            'total_assets': total_assets,
            'diversification_score': min(100, total_assets * 10),
            'recommendations': [
                'Consider adding bonds to reduce volatility',
                'Your portfolio is well diversified',
                'Monitor high-risk assets closely'
            ]
        }
        
        return Response(risk_data)

class AssetViewSet(viewsets.ModelViewSet):
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Asset.objects.filter(portfolio__user=self.request.user)
    
    def perform_create(self, serializer):
        # Get portfolio from request or create a default one
        portfolio_id = self.request.data.get('portfolio_id')
        if portfolio_id:
            portfolio = Portfolio.objects.get(
                id=portfolio_id, 
                user=self.request.user
            )
        else:
            portfolio, created = Portfolio.objects.get_or_create(
                user=self.request.user,
                name="Default Portfolio",
                defaults={'total_value': 0, 'risk_score': 50}
            )
        
        serializer.save(portfolio=portfolio)

# Public API endpoints (no authentication required)
@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_data(request):
    """Get sample dashboard data for demo purposes"""
    data = {
        'risk_score': random.randint(60, 85),
        'portfolio_value': 125000.50,
        'daily_change': {
            'amount': random.randint(-500, 1500),
            'percentage': random.uniform(-0.5, 2.0)
        },
        'risk_metrics': {
            'volatility': random.choice(['Low', 'Medium', 'High']),
            'concentration': random.choice(['Low', 'Medium', 'High']),
            'diversification': random.choice(['Poor', 'Good', 'Excellent'])
        },
        'top_assets': [
            {'symbol': 'AAPL', 'name': 'Apple Inc.', 'value': 25000, 'percentage': 20},
            {'symbol': 'GOOGL', 'name': 'Alphabet Inc.', 'value': 18750, 'percentage': 15},
            {'symbol': 'MSFT', 'name': 'Microsoft Corp.', 'value': 15000, 'percentage': 12},
            {'symbol': 'TSLA', 'name': 'Tesla Inc.', 'value': 12500, 'percentage': 10},
        ],
        'allocation': {
            'stocks': 65,
            'bonds': 20,
            'crypto': 10,
            'real_estate': 5
        }
    }
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def market_data(request):
    """Get sample market data"""
    data = {
        'indices': [
            {'name': 'S&P 500', 'value': 4500.25, 'change': 1.25},
            {'name': 'NASDAQ', 'value': 14200.75, 'change': -0.75},
            {'name': 'DOW', 'value': 35000.50, 'change': 0.5},
        ],
        'trending_stocks': [
            {'symbol': 'NVDA', 'price': 450.25, 'change': 5.2},
            {'symbol': 'AMD', 'price': 125.75, 'change': -2.1},
            {'symbol': 'META', 'price': 280.50, 'change': 3.4},
        ]
    }
    return Response(data)