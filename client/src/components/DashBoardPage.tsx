import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Shield, BarChart3, PieChart, AlertTriangle, CheckCircle, ArrowRight, Home, Building, MapPin, Eye, EyeOff, Zap, Target } from 'lucide-react';
import Navbar from './Navbar';

const DashboardPage = () => {
  const [selectedZone, setSelectedZone] = useState('all');
  const [showReturns, setShowReturns] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mock data with real estate included
  const safeInvestments = [
    { name: 'Fixed Deposits', amount: 500000, return: 6.5, icon: Shield, trend: [6.2, 6.3, 6.5], change: '+0.3%' },
    { name: 'Government Bonds', amount: 300000, return: 7.2, icon: Shield, trend: [7.0, 7.1, 7.2], change: '+0.2%' },
    { name: 'PPF', amount: 150000, return: 8.1, icon: Shield, trend: [7.9, 8.0, 8.1], change: '+0.2%' },
    { name: 'EPF', amount: 420000, return: 8.5, icon: Shield, trend: [8.3, 8.4, 8.5], change: '+0.2%' }
  ];

  const diversifiedInvestments = [
    { name: 'Large Cap Mutual Funds', amount: 800000, return: 12.4, icon: BarChart3, trend: [10.2, 11.8, 12.4], change: '+2.2%' },
    { name: 'Index Funds (Nifty 50)', amount: 450000, return: 11.8, icon: PieChart, trend: [9.5, 10.9, 11.8], change: '+2.3%' },
    { name: 'Balanced Funds', amount: 320000, return: 10.2, icon: BarChart3, trend: [8.9, 9.7, 10.2], change: '+1.3%' },
    { name: 'Gold ETF', amount: 200000, return: 8.9, icon: TrendingUp, trend: [7.2, 8.1, 8.9], change: '+1.7%' },
    { name: 'International Funds', amount: 180000, return: 15.2, icon: BarChart3, trend: [12.1, 13.8, 15.2], change: '+3.1%' }
  ];

  const realEstateInvestments = [
    { name: 'Residential Property - Andheri', amount: 8500000, return: 7.8, icon: Home, trend: [6.5, 7.2, 7.8], change: '+1.3%', location: 'Mumbai', sqft: '850 sq ft' },
    { name: 'Commercial Space - BKC', amount: 5200000, return: 9.2, icon: Building, trend: [8.1, 8.7, 9.2], change: '+1.1%', location: 'Mumbai', sqft: '420 sq ft' },
    { name: 'REITs Portfolio', amount: 340000, return: 11.4, icon: Building, trend: [9.8, 10.6, 11.4], change: '+1.6%', location: 'Mixed', sqft: 'Units: 45' }
  ];

  const underperformingInvestments = [
    { name: 'Small Cap Stocks', amount: 180000, return: -5.2, icon: TrendingDown, trend: [-2.1, -3.8, -5.2], change: '-3.1%' },
    { name: 'Sector Fund - IT', amount: 125000, return: -2.8, icon: AlertTriangle, trend: [1.2, -0.8, -2.8], change: '-4.0%' },
    { name: 'Cryptocurrency', amount: 95000, return: -15.4, icon: TrendingDown, trend: [-8.2, -12.1, -15.4], change: '-7.2%' },
    { name: 'Mid Cap Fund', amount: 85000, return: -1.2, icon: AlertTriangle, trend: [2.1, 0.5, -1.2], change: '-3.3%' }
  ];

  const allInvestments = [
    ...safeInvestments,
    ...diversifiedInvestments,
    ...realEstateInvestments,
    ...underperformingInvestments
  ];

  const totalPortfolio = allInvestments.reduce((sum, inv) => sum + inv.amount, 0);

  // Animation effect for counters
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        total: totalPortfolio,
        safe: safeInvestments.reduce((sum, inv) => sum + inv.amount, 0),
        diversified: diversifiedInvestments.reduce((sum, inv) => sum + inv.amount, 0),
        realEstate: realEstateInvestments.reduce((sum, inv) => sum + inv.amount, 0),
        underperforming: underperformingInvestments.reduce((sum, inv) => sum + inv.amount, 0)
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getFilteredInvestments = () => {
    switch(selectedZone) {
      case 'safe': return safeInvestments;
      case 'diversified': return diversifiedInvestments;
      case 'realestate': return realEstateInvestments;
      case 'underperforming': return underperformingInvestments;
      default: return allInvestments;
    }
  };

  const MiniChart = ({ trend, positive }) => (
    <div className="flex items-end space-x-1 h-8">
      {trend.map((value, index) => (
        <div 
          key={index}
          className={`w-1 rounded-full transition-all duration-1000 delay-${index * 100} ${
            positive ? 'bg-green-400' : 'bg-red-400'
          }`}
          style={{ 
            height: `${(Math.abs(value) / Math.max(...trend.map(Math.abs))) * 100}%`,
            animation: `slideUp 0.8s ease-out ${index * 0.1}s both`
          }}
        />
      ))}
    </div>
  );

  const InvestmentCard = ({ investment, zoneColor, index }) => {
    const Icon = investment.icon;
    const isHovered = hoveredCard === `${investment.name}-${index}`;
    
    return (
      <div 
        className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${
          isHovered ? 'ring-2 ring-indigo-300' : ''
        }`}
        onMouseEnter={() => setHoveredCard(`${investment.name}-${index}`)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${zoneColor.replace('text-', 'bg-').replace('600', '100')} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-5 h-5 ${zoneColor} group-hover:animate-pulse`} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{investment.name}</h4>
              {investment.location && (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {investment.location} {investment.sqft && `• ${investment.sqft}`}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            {showReturns && (
              <span className={`text-sm font-bold flex items-center ${
                investment.return >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {investment.return > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {investment.return > 0 ? '+' : ''}{investment.return}%
              </span>
            )}
            <div className="text-xs text-gray-500 mt-1">{investment.change}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {formatCurrency(investment.amount)}
          </p>
          {isHovered && <MiniChart trend={investment.trend} positive={investment.return >= 0} />}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex-1 bg-gray-100 rounded-full h-2 mr-3 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${zoneColor.replace('text-', 'bg-')} group-hover:animate-pulse`}
              style={{ 
                width: `${Math.min((investment.amount / totalPortfolio) * 100 * 4, 100)}%`,
                animationDelay: `${index * 0.1}s`
              }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500">
            {((investment.amount / totalPortfolio) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  const ZoneButton = ({ zone, label, color, count, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
        isActive 
          ? `${color} text-white shadow-lg` 
          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
      }`}
    >
      <span className="flex items-center space-x-2">
        <span>{label}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          isActive ? 'bg-white/20' : 'bg-gray-200'
        }`}>
          {count}
        </span>
      </span>
    </button>
  );

  const insights = [
    {
      title: "Portfolio Health",
      value: "89/100",
      description: "Excellent diversification with strong real estate backing",
      icon: Target,
      color: "text-green-600",
      trend: "+5 points"
    },
    {
      title: "Monthly Returns",
      value: "₹1.2L",
      description: "Consistent income from rentals and dividends",
      icon: Zap,
      color: "text-blue-600",
      trend: "+12%"
    },
    {
      title: "Risk Score",
      value: "Moderate",
      description: "Well-balanced risk profile with safety net",
      icon: Shield,
      color: "text-amber-600",
      trend: "Stable"
    },
    {
      title: "Growth Potential",
      value: "High",
      description: "Real estate and equity mix shows promise",
      icon: TrendingUp,
      color: "text-indigo-600",
      trend: "+18%"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
      
      <Navbar/>
      <div className="max-w-7xl mx-auto">
        {/* Header with Controls */}
        <div className="mb-8 animate-fadeInUp">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Investment Portfolio
              </h1>
              <p className="text-gray-600">Real-time overview of your diversified investment strategy</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button
                onClick={() => setShowReturns(!showReturns)}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                {showReturns ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {showReturns ? 'Hide' : 'Show'} Returns
                </span>
              </button>
            </div>
          </div>

          {/* Zone Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <ZoneButton
              zone="all"
              label="All Assets"
              color="bg-indigo-600"
              count={allInvestments.length}
              isActive={selectedZone === 'all'}
              onClick={() => setSelectedZone('all')}
            />
            <ZoneButton
              zone="safe"
              label="Safe Zone"
              color="bg-green-600"
              count={safeInvestments.length}
              isActive={selectedZone === 'safe'}
              onClick={() => setSelectedZone('safe')}
            />
            <ZoneButton
              zone="diversified"
              label="Growth Zone"
              color="bg-blue-600"
              count={diversifiedInvestments.length}
              isActive={selectedZone === 'diversified'}
              onClick={() => setSelectedZone('diversified')}
            />
            <ZoneButton
              zone="realestate"
              label="Real Estate"
              color="bg-purple-600"
              count={realEstateInvestments.length}
              isActive={selectedZone === 'realestate'}
              onClick={() => setSelectedZone('realestate')}
            />
            <ZoneButton
              zone="underperforming"
              label="Review Zone"
              color="bg-red-600"
              count={underperformingInvestments.length}
              isActive={selectedZone === 'underperforming'}
              onClick={() => setSelectedZone('underperforming')}
            />
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Total Portfolio</p>
                <p className="text-3xl font-bold">{formatCurrency(animatedValues.total)}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-2 text-green-300" />
              <span className="text-green-300">+12.4% YoY Growth</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-green-200 text-sm">Safe Assets</p>
                <p className="text-2xl font-bold">{formatCurrency(animatedValues.safe)}</p>
              </div>
              <Shield className="w-8 h-8 text-green-200" />
            </div>
            <p className="text-sm text-green-200">22% of portfolio</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-blue-200 text-sm">Growth Assets</p>
                <p className="text-2xl font-bold">{formatCurrency(animatedValues.diversified)}</p>
              </div>
              <PieChart className="w-8 h-8 text-blue-200" />
            </div>
            <p className="text-sm text-blue-200">31% of portfolio</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-purple-200 text-sm">Real Estate</p>
                <p className="text-2xl font-bold">{formatCurrency(animatedValues.realEstate)}</p>
              </div>
              <Home className="w-8 h-8 text-purple-200" />
            </div>
            <p className="text-sm text-purple-200">42% of portfolio</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-red-200 text-sm">Review Zone</p>
                <p className="text-2xl font-bold">{formatCurrency(animatedValues.underperforming)}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
            <p className="text-sm text-red-200">5% of portfolio</p>
          </div>
        </div>

        {/* Investment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {getFilteredInvestments().map((investment, index) => {
            let zoneColor = 'text-gray-600';
            if (safeInvestments.includes(investment)) zoneColor = 'text-green-600';
            if (diversifiedInvestments.includes(investment)) zoneColor = 'text-blue-600';
            if (realEstateInvestments.includes(investment)) zoneColor = 'text-purple-600';
            if (underperformingInvestments.includes(investment)) zoneColor = 'text-red-600';
            
            return (
              <InvestmentCard 
                key={`${investment.name}-${index}`} 
                investment={investment} 
                zoneColor={zoneColor}
                index={index}
              />
            );
          })}
        </div>

        {/* Enhanced Insights */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 mb-8 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Portfolio Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group animate-fadeInUp"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${insight.color.replace('text-', 'bg-').replace('600', '100')} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${insight.color}`} />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {insight.trend}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <p className={`text-xl font-bold mb-2 ${insight.color}`}>{insight.value}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{insight.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Action Center */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl animate-fadeInUp">
          <h3 className="text-2xl font-bold mb-6">Smart Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold">Rebalance Portfolio</h4>
              </div>
              <p className="text-white/80 text-sm">Consider moving ₹50K from crypto to diversified funds for better stability</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold">Real Estate Opportunity</h4>
              </div>
              <p className="text-white/80 text-sm">Mumbai property prices showing upward trend - consider additional REIT investments</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold">Tax Optimization</h4>
              </div>
              <p className="text-white/80 text-sm">Increase ELSS allocation by ₹25K to maximize tax benefits under 80C</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;