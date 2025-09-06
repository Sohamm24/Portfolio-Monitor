# portfolio/models.py
from django.db import models
from django.contrib.auth.models import User

class Portfolio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    total_value = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    risk_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s {self.name}"

class Asset(models.Model):
    ASSET_TYPES = [
        ('STOCK', 'Stock'),
        ('BOND', 'Bond'),
        ('CRYPTO', 'Cryptocurrency'),
        ('REAL_ESTATE', 'Real Estate'),
        ('COMMODITY', 'Commodity'),
    ]
    
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='assets')
    symbol = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPES)
    quantity = models.DecimalField(max_digits=15, decimal_places=6)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.symbol} - {self.name}"

    @property
    def total_value(self):
        return self.quantity * self.current_price

    @property
    def profit_loss(self):
        return (self.current_price - self.purchase_price) * self.quantity

class RiskMetrics(models.Model):
    portfolio = models.OneToOneField(Portfolio, on_delete=models.CASCADE)
    volatility = models.CharField(max_length=10, default='Medium')
    concentration = models.CharField(max_length=10, default='Medium')
    diversification = models.CharField(max_length=10, default='Good')
    sharpe_ratio = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    beta = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"Risk metrics for {self.portfolio.name}"