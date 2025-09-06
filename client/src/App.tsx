import React, { useState, useEffect, useRef } from 'react';

interface DashboardData {
  risk_score: number;
  portfolio_value: number;
  daily_change: {
    amount: number;
    percentage: number;
  };
  risk_metrics: {
    volatility: string;
    concentration: string;
    diversification: string;
  };
  top_assets: Array<{
    symbol: string;
    name: string;
    value: number;
    percentage: number;
  }>;
  allocation: {
    stocks: number;
    bonds: number;
    crypto: number;
    real_estate: number;
  };
}

interface MarketData {
  indices: Array<{
    name: string;
    value: number;
    change: number;
  }>;
  trending_stocks: Array<{
    symbol: string;
    price: number;
    change: number;
  }>;
}

const PortfolioRiskMonitor: React.FC = () => {
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const riskMeterRef = useRef<HTMLDivElement>(null);

  // API Configuration
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard data
        const dashboardResponse = await fetch(`${API_BASE_URL}/api/dashboard/`);
        if (!dashboardResponse.ok) {
          throw new Error(`Dashboard API error: ${dashboardResponse.status}`);
        }
        const dashboardResult = await dashboardResponse.json();
        setDashboardData(dashboardResult);

        // Fetch market data
        const marketResponse = await fetch(`${API_BASE_URL}/api/market/`);
        if (!marketResponse.ok) {
          throw new Error(`Market API error: ${marketResponse.status}`);
        }
        const marketResult = await marketResponse.json();
        setMarketData(marketResult);

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        
        // Set fallback data
        setDashboardData({
          risk_score: 72,
          portfolio_value: 125000.50,
          daily_change: { amount: 1250, percentage: 1.2 },
          risk_metrics: {
            volatility: 'Low',
            concentration: 'High',
            diversification: 'Good'
          },
          top_assets: [
            { symbol: 'AAPL', name: 'Apple Inc.', value: 25000, percentage: 20 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 18750, percentage: 15 },
            { symbol: 'MSFT', name: 'Microsoft Corp.', value: 15000, percentage: 12 },
          ],
          allocation: { stocks: 65, bonds: 20, crypto: 10, real_estate: 5 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Risk score animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && dashboardData) {
          animateCounter(dashboardData.risk_score);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (riskMeterRef.current && dashboardData) {
      observer.observe(riskMeterRef.current);
    }

    return () => observer.disconnect();
  }, [dashboardData]);

  const animateCounter = (targetScore: number) => {
    let current = 0;
    const increment = targetScore / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        current = targetScore;
        clearInterval(timer);
      }
      setRiskScore(Math.floor(current));
    }, 30);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-emerald-500' : 'text-red-500';
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-emerald-500';
      case 'medium': return 'text-amber-500';
      case 'high': return 'text-red-500';
      default: return 'text-blue-600';
    }
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const link = e.currentTarget;
    const originalText = link.textContent;
    link.textContent = 'Loading...';
    link.style.opacity = '0.7';
    
    setTimeout(() => {
      // Replace with actual navigation logic
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="font-sans text-slate-800 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isNavbarScrolled 
          ? 'bg-white/98 backdrop-blur-md shadow-lg border-b border-black/10' 
          : 'bg-white/95 backdrop-blur-md border-b border-black/10'
      }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-700">
            <span className="text-3xl">📊</span>
            Portfolio Risk Monitor
          </div>
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <a 
                href="#features" 
                onClick={(e) => handleSmoothScroll(e, '#features')}
                className="text-slate-800 font-medium hover:text-blue-600 transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a 
                href="#market-data" 
                onClick={(e) => handleSmoothScroll(e, '#market-data')}
                className="text-slate-800 font-medium hover:text-blue-600 transition-colors"
              >
                Market
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                onClick={(e) => handleSmoothScroll(e, '#contact')}
                className="text-slate-800 font-medium hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
          <a 
            href="#dashboard" 
            onClick={handleCTAClick}
            className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg shadow-blue-700/30"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-48 left-48 w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-72 right-48 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-48 left-72 w-60 h-60 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent animate-fade-in">
              Smart Portfolio Risk Analysis
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed animate-fade-in">
              Monitor, analyze, and optimize your investment portfolio with AI-powered risk assessment. Make smarter financial decisions with real-time insights.
            </p>
            
            {/* Live Portfolio Stats */}
            {dashboardData && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 animate-fade-in">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(dashboardData.portfolio_value)}
                    </div>
                    <div className="text-sm text-slate-300">Portfolio Value</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${getChangeColor(dashboardData.daily_change.percentage)}`}>
                      {formatPercentage(dashboardData.daily_change.percentage)}
                    </div>
                    <div className="text-sm text-slate-300">Daily Change</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in">
              <a 
                href="#dashboard" 
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-emerald-600/40"
              >
                Analyze Your Portfolio
              </a>
              <a 
                href="#demo" 
                onClick={(e) => handleSmoothScroll(e, '#demo')}
                className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 backdrop-blur-sm"
              >
                View Demo
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="animate-fade-in">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              
              {loading ? (
                <div className="bg-white rounded-xl p-6 min-h-80 flex items-center justify-center">
                  <div className="animate-pulse text-slate-500">Loading dashboard data...</div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-xl p-6 min-h-80 flex items-center justify-center">
                  <div className="text-red-500">Error loading data. Using demo values.</div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 min-h-80">
                  <div className="flex flex-col items-center">
                    <div 
                      ref={riskMeterRef}
                      className="relative w-32 h-32 rounded-full mb-4 cursor-pointer transition-transform duration-300 hover:scale-105"
                      style={{
                        background: 'conic-gradient(#10b981 0deg, #f59e0b 120deg, #ef4444 240deg)'
                      }}
                    >
                      <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-800">{riskScore}</span>
                      </div>
                    </div>
                    <h4 className="text-center mb-4 text-slate-800 font-semibold">Portfolio Risk Score</h4>
                    <div className="flex justify-between w-full">
                      <div className="text-center">
                        <div className="text-sm text-slate-500">Concentration</div>
                        <div className={`text-lg font-semibold ${getRiskColor(dashboardData?.risk_metrics.concentration || 'High')}`}>
                          {dashboardData?.risk_metrics.concentration || 'High'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-slate-500">Volatility</div>
                        <div className={`text-lg font-semibold ${getRiskColor(dashboardData?.risk_metrics.volatility || 'Low')}`}>
                          {dashboardData?.risk_metrics.volatility || 'Low'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-slate-500">Diversification</div>
                        <div className={`text-lg font-semibold ${getRiskColor(dashboardData?.risk_metrics.diversification || 'Good')}`}>
                          {dashboardData?.risk_metrics.diversification || 'Good'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Market Data Section */}
      {marketData && (
        <section id="market-data" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Live Market Data</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Market Indices */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">Market Indices</h3>
                <div className="space-y-4">
                  {marketData.indices.map((index, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">{index.name}</span>
                      <div className="text-right">
                        <div className="font-bold">{index.value.toLocaleString()}</div>
                        <div className={`text-sm ${getChangeColor(index.change)}`}>
                          {formatPercentage(index.change)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Stocks */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">Trending Stocks</h3>
                <div className="space-y-4">
                  {marketData.trending_stocks.map((stock, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">{stock.symbol}</span>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(stock.price)}</div>
                        <div className={`text-sm ${getChangeColor(stock.change)}`}>
                          {formatPercentage(stock.change)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Assets Section */}
      {dashboardData?.top_assets && (
        <section className="py-16 bg-slate-100">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Portfolio Holdings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardData.top_assets.map((asset, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800">{asset.symbol}</h3>
                      <p className="text-sm text-slate-600">{asset.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{asset.percentage}%</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-800">
                    {formatCurrency(asset.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">Comprehensive Risk Analysis</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our AI-powered platform provides institutional-grade portfolio analysis with real-time insights and actionable recommendations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Multi-Asset Analysis",
                description: "Analyze portfolios across stocks, bonds, real estate, commodities, and alternative investments with comprehensive risk metrics.",
                gradient: "from-blue-600 to-blue-700"
              },
              {
                icon: "⚡",
                title: "Real-Time Monitoring",
                description: "Get instant alerts when your portfolio risk levels change or when rebalancing opportunities arise.",
                gradient: "from-emerald-600 to-emerald-700"
              },
              {
                icon: "🎯",
                title: "Smart Rebalancing",
                description: "AI-driven recommendations for optimal portfolio allocation based on your risk tolerance and investment goals.",
                gradient: "from-amber-500 to-amber-600"
              },
              {
                icon: "🔒",
                title: "Risk Management",
                description: "Advanced risk metrics including VaR, correlation analysis, and stress testing to protect your investments.",
                gradient: "from-red-500 to-red-600"
              },
              {
                icon: "📈",
                title: "Performance Analytics",
                description: "Track risk-adjusted returns, Sharpe ratios, and performance attribution across all asset classes.",
                gradient: "from-purple-600 to-purple-700"
              },
              {
                icon: "🤖",
                title: "AI-Powered Insights",
                description: "Machine learning algorithms detect patterns and anomalies to provide predictive risk analysis.",
                gradient: "from-cyan-600 to-cyan-700"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Updated with dynamic data */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-emerald-400 mb-2">500+</h3>
            <p className="text-slate-300 text-lg">Assets Analyzed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-emerald-400 mb-2">99.9%</h3>
            <p className="text-slate-300 text-lg">Uptime</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-emerald-400 mb-2">24/7</h3>
            <p className="text-slate-300 text-lg">Monitoring</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-emerald-400 mb-2">
              {dashboardData ? formatCurrency(dashboardData.portfolio_value).replace('$', '$') : 'Real-time'}
            </h3>
            <p className="text-slate-300 text-lg">Portfolio Value</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Optimize Your Portfolio?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors who trust our AI-powered risk analysis to make better investment decisions.
          </p>
          <a 
            href="#dashboard" 
            onClick={handleCTAClick}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-12 py-5 rounded-full font-semibold text-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-emerald-600/40 inline-block"
          >
            Start Free Analysis
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-white text-center">
        <div className="max-w-6xl mx-auto px-8">
          <p>&copy; 2025 Portfolio Risk Monitor. Built for smarter investing.</p>
          {error && (
            <p className="text-sm text-slate-400 mt-2">
              Demo mode - Connect to Django backend for live data
            </p>
          )}
        </div>
      </footer>

      {/* Custom Styles for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeInUp 0.8s ease forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PortfolioRiskMonitor;