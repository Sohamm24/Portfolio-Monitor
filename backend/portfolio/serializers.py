# portfolio/serializers.py
from rest_framework import serializers
from .models import Portfolio, Asset, RiskMetrics

class AssetSerializer(serializers.ModelSerializer):
    total_value = serializers.ReadOnlyField()
    profit_loss = serializers.ReadOnlyField()
    
    class Meta:
        model = Asset
        fields = [
            'id', 'symbol', 'name', 'asset_type', 'quantity', 
            'purchase_price', 'current_price', 'total_value', 
            'profit_loss', 'created_at'
        ]

class RiskMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskMetrics
        fields = [
            'volatility', 'concentration', 'diversification', 
            'sharpe_ratio', 'beta'
        ]

class PortfolioSerializer(serializers.ModelSerializer):
    assets = AssetSerializer(many=True, read_only=True)
    riskmetrics = RiskMetricsSerializer(read_only=True)
    asset_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Portfolio
        fields = [
            'id', 'name', 'total_value', 'risk_score', 
            'created_at', 'updated_at', 'assets', 'riskmetrics', 
            'asset_count'
        ]
    
    def get_asset_count(self, obj):
        return obj.assets.count()

class PortfolioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['name', 'total_value']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)